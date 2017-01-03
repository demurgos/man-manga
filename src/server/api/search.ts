import * as _ from "lodash";
import * as apiInterfaces from "../../lib/interfaces/api/index";
import * as alchemy from "../lib/alchemy";
import * as DBPedia from "../lib/dbpedia/search";
import * as DBPediaUtils from "../lib/dbpedia/utils";
import * as googlesearch from "../lib/googlesearch";
import * as spotlight from "../lib/spotlight";
import {AnilistApi} from "../lib/anilist-api.class";
import {Manga} from "../../lib/interfaces/resources/manga";

let anilist: AnilistApi = new AnilistApi();

/**
 * Returns a list of spotlight URLs related to the query.
 *
 * @param query
 * @returns {Promise<string[]>}
 */
export async function search(query: string): Promise<apiInterfaces.search.SearchResult[]> {
  console.log(`Search: ${JSON.stringify(query)}`);
  const googlesearchQuery: string = buildGooglesearchQuery(query);
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
    semanticPromises.push(DBPedia.search(resource));
  }
  const semanticResults: (apiInterfaces.search.SearchResult | null)[] = await Promise.all(semanticPromises);

  const cleanedResults: apiInterfaces.search.SearchResult[] = [];
  for (const result of semanticResults) {
    if (result !== null) {
      if(result.type === "manga") {
        console.log("RESULTTTTTTTTTTTTTT");
        console.log(result);
        (<Manga>result).coverUrl = await anilist.getCoverUrl(DBPediaUtils.resourceUrlToName((<Manga>result).title));
      }
      cleanedResults.push(result);
    }
  }
  console.log("Final results:");
  console.log(cleanedResults);

  return cleanedResults;
}


function buildGooglesearchQuery(userQuery: string): string {
  // TODO: configuration options
  return `${userQuery} manga OR anime`;
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
// export async function search2(query: string): Promise<apiInterfaces.search.SearchResult[]> {
//   console.log(`Search: ${JSON.stringify(query)}`);
//   const googlesearchQuery: string = buildGooglesearchQuery(query);
//   const searchResults: googlesearch.SearchResult[] = await googlesearch.search({query: googlesearchQuery});
//   console.log("Google results");
//   console.log(searchResults);
//   return Promise.all(searchResults
//     .slice(0, 3)
//     .map(async (searchResult: googlesearch.SearchResult): Promise<DBPedia.SearchResult> => {
//       const url: string = searchResult.link;
//       console.log(`dbpedia search for ${url}`);
//       const dbpediaResult: DBPedia.SearchResult = await DBPedia.search(DBPedia.wikipediaArticleUrlToResourceUrl(url));
//       if (dbpediaResult && dbpediaResult.manga !== undefined) {
//         const manga: Manga = dbpediaResult.manga;
//         try {
//           console.log("COVERING: " + DBPedia.resourceUrlToName(manga.title));
//           const cover: string = await anilist.getCoverUrl(DBPedia.resourceUrlToName(manga.title));
//           manga.coverUrl = cover;
//         } catch (err) {
//           // At this point, it's not a problem if we don't find any cover
//           // Just return the result
//           // TODO: try to get something with anilist ?
//         }
//       }
//       console.log("DBPedia result, maybe with cover");
//       console.log(dbpediaResult);
//       return dbpediaResult;
//     }));
// }
