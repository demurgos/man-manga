import * as _ from "lodash";
import * as apiInterfaces from "../../lib/interfaces/api/index";
import {Anime, Author, Character, Manga} from "../../lib/interfaces/resources/index";
import * as alchemy from "../lib/alchemy";
import {search as dbpediaSearch} from "../lib/dbpedia/index";
import * as googlesearch from "../lib/googlesearch";
import * as spotlight from "../lib/spotlight";

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

async function getResources(uri: string): Promise<string[]> {
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

/**
 * A test pipeline using specific search.
 */
export async function search(query: string,
                             searchTypes: SearchTypes | null = null): Promise<apiInterfaces.search.SearchResult[]> {
  console.log(`Search: ${JSON.stringify(query)}`);
  const googlesearchQuery: string = buildGooglesearchQuery(query, searchTypes);
  const searchResults: googlesearch.SearchResult[] = await googlesearch.search({query: googlesearchQuery});
  console.log("Google results:");
  const spotLightPromises: Promise<string[]>[] = [];
  for (const searchResult of searchResults) {
    spotLightPromises.push(getResources(searchResult.link));
  }

  const resolvedSpotLight: string[][] = await Promise.all(spotLightPromises);
  const resources: string[] = _.uniq(_.flatten(resolvedSpotLight));
  console.log("Resources:");
  console.log(resources);

  const semanticPromises: Promise<apiInterfaces.search.SearchResult | null>[] = [];
  for (const resource of resources) {
    semanticPromises.push(dbpediaSearch(resource));
  }
  const semanticResults: (apiInterfaces.search.SearchResult | null)[] = await Promise.all(semanticPromises);

  const cleanedResults: apiInterfaces.search.SearchResult[] = [];
  for (const result of semanticResults) {
    if (result !== null) {
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
