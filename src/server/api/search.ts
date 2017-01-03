import Bluebird = require("bluebird");
import * as _ from "lodash";
import * as path from "path";
import * as url from "url";
import * as apiInterfaces from "../../lib/interfaces/api/index";
import {Anime, Author, Character, Manga} from "../../lib/interfaces/resources/index";
import * as alchemy from "../lib/alchemy";
import {AnilistApi} from "../lib/anilist-api.class";
import {search as dbpediaSearch} from "../lib/dbpedia/index";
import * as googlesearch from "../lib/googlesearch";
import * as spotlight from "../lib/spotlight";

const anilist: AnilistApi = new AnilistApi();

export interface SearchTypes {
  anime?: boolean;
  author?: boolean;
  character?: boolean;
  manga?: boolean;
}

function buildGooglesearchQuery(userQuery: string, searchTypes: SearchTypes | null = null): string {
  if (searchTypes === null) {
    return userQuery;
  }
  const keywords: string[] = [];
  if (searchTypes.anime) {
    keywords.push("anime");
  }
  if (searchTypes.author) {
    keywords.push("author");
  }
  if (searchTypes.character) {
    keywords.push("character");
  }
  if (searchTypes.manga) {
    keywords.push("manga");
  }

  return `${userQuery} ${keywords.join("OR")}`;
}

async function getSpotlightResources(uri: string): Promise<string[]> {
  try {
    console.log("Alchemy");
    const alchemyResult: alchemy.Result = await alchemy.getTextFromURL(uri);
    console.log("Alchemy result:");
    console.log(alchemyResult);
    console.log("Spotlight");
    const spotlightResult: string[] = await spotlight.query(alchemyResult.text, alchemyResult.language);
    console.log("Spotlight result:");
    console.log(spotlightResult);
    return spotlightResult;
  } catch (err) {
    console.warn(err);
    return [];
  }
}

async function getResourcesFromSpotlight(userQuery: string, searchTypes: SearchTypes | null = null): Promise<string[]> {
  try {
    const googlesearchQuery: string = buildGooglesearchQuery(userQuery, searchTypes);
    const searchResults: googlesearch.SearchResult[] = await googlesearch.search({query: googlesearchQuery});
    console.log("Google results:");
    console.log(searchResults);
    const spotLightPromises: Promise<string[]>[] = [];
    for (const searchResult of searchResults) {
      spotLightPromises.push(getSpotlightResources(searchResult.link));
    }

    const resolvedSpotLight: string[][] = await Promise.all(spotLightPromises);
    return _.uniq(_.flatten(resolvedSpotLight));
  } catch (err) {
    console.warn(err);
    return [];
  }
}

const wikipediaHost: string = "en.wikipedia.org";
const dbpediaHost: string = "dbpedia.org";

function wikipediaArticleUriToDbpediaResourceIri(articleUri: string): string | null {
  const parsedUri: url.Url = url.parse(articleUri);
  if (parsedUri.host !== wikipediaHost || parsedUri.pathname === null || parsedUri.pathname === undefined) {
    return null;
  }
  const articlePath: path.ParsedPath = path.posix.parse(parsedUri.pathname);
  if (articlePath.dir !== "/wiki") {
    return null;
  }
  const resouceId: string = articlePath.base;
  const dbpediaIri: url.Url = {
    protocol: "http",
    hostname: dbpediaHost,
    pathname: path.posix.join("/", "resource", resouceId)
  };
  return url.format(dbpediaIri);
}

async function getResourceIrisFromWikipedia(userQuery: string,
                                            searchTypes: SearchTypes | null = null): Promise<string[]> {
  try {
    const googlesearchQuery: string = buildGooglesearchQuery(`${userQuery} site:${wikipediaHost}`, searchTypes);
    const searchResults: googlesearch.SearchResult[] = await googlesearch.search({query: googlesearchQuery});
    console.log("Google results:");
    console.log(searchResults);
    const wikipediaResources: string[] = [];
    for (const searchResult of searchResults) {
      try {
        const dbpediaIri: string | null = wikipediaArticleUriToDbpediaResourceIri(searchResult.link);
        if (dbpediaIri !== null) {
          wikipediaResources.push(dbpediaIri);
        }
      } catch (err) {
        // ignore parse / access errors
        console.warn(err);
      }
    }
    return _.uniq(wikipediaResources);
  } catch (err) {
    console.warn(err);
    return [];
  }
}

/**
 * A test pipeline using specific search.
 */
export async function search(query: string,
                             searchTypes: SearchTypes | null = null): Promise<apiInterfaces.search.SearchResult[]> {
  console.log(`Search: ${JSON.stringify(query)}`);

  const spotlightResources: string[] = await getResourcesFromSpotlight(query, searchTypes);
  const wikipediaResources: string[] = await getResourceIrisFromWikipedia(query, searchTypes);

  const resources: string[] = _.uniq(_.concat(spotlightResources, wikipediaResources));
  console.log("Resources:");
  console.log(resources);

  resources.length = Math.min(resources.length, 25);

  const semanticPromises: Bluebird<(apiInterfaces.search.SearchResult | null)[]> = Bluebird.map(
    resources,
    async function (resourceIri: string): Promise<apiInterfaces.search.SearchResult | null> {
      return Bluebird
        .try((): Promise<apiInterfaces.search.SearchResult | null> => {
          return dbpediaSearch(resourceIri);
        })
        .timeout(2000)
        .catch((err: Error) => {
          console.warn(err);
          return null;
        })
        .tap(console.log);
    },
    {concurrency: 5}
  );

  const semanticResults: (apiInterfaces.search.SearchResult | null)[] = await semanticPromises;

  const cleanedResults: apiInterfaces.search.SearchResult[] = [];
  for (const result of semanticResults) {
    if (result !== null) {
      if (result.type === "manga") {
        try {
          const coverUrl: string | null = await anilist.getCoverUrl(result.title);
          if (coverUrl !== null) {
            result.coverUrl = coverUrl;
          }
        } catch (err) {
          // Ignore missing cover
          console.warn(err);
        }
      }
      if (result.type === "anime") {
        try {
          const posterUrl: string | null = await anilist.getPosterUrl(result.title);
          if (posterUrl !== null) {
            result.posterUrl = posterUrl;
          }
        } catch (err) {
          // Ignore missing poster
          console.warn(err);
        }
      }
      cleanedResults.push(result);
    }
  }
  console.log("Final results:");
  console.log(cleanedResults);

  return cleanedResults;
}

export async function searchAny(query: string): Promise<apiInterfaces.search.SearchResult[]> {
  return search(query, null);
}

export async function searchResource(query: string): Promise<apiInterfaces.search.SearchResult[]> {
  return search(query, {anime: true, author: true, character: true, manga: true});
}

export async function searchAnime(query: string): Promise<Anime[]> {
  const searchResults: apiInterfaces.search.SearchResult[] = await search(query, {anime: true});
  const mangas: Anime[] = [];
  for (const searchResult of searchResults) {
    if (searchResult.type === "anime") {
      mangas.push(searchResult);
    }
  }
  return mangas;
}

export async function searchAuthor(query: string): Promise<Author[]> {
  const searchResults: apiInterfaces.search.SearchResult[] = await search(query, {author: true});
  const mangas: Author[] = [];
  for (const searchResult of searchResults) {
    if (searchResult.type === "author") {
      mangas.push(searchResult);
    }
  }
  return mangas;
}

export async function searchCharacter(query: string): Promise<Character[]> {
  const searchResults: apiInterfaces.search.SearchResult[] = await search(query, {author: true});
  const mangas: Character[] = [];
  for (const searchResult of searchResults) {
    if (searchResult.type === "character") {
      mangas.push(searchResult);
    }
  }
  return mangas;
}

export async function searchManga(query: string): Promise<Manga[]> {
  const searchResults: apiInterfaces.search.SearchResult[] = await search(query, {manga: true});
  const mangas: Manga[] = [];
  for (const searchResult of searchResults) {
    if (searchResult.type === "manga") {
      mangas.push(searchResult);
    }
  }
  return mangas;
}
