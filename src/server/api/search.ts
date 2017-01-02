import * as apiInterfaces from "../../lib/interfaces/api/index";
import {MangaCover} from "../../lib/interfaces/resources/index";
import * as alchemy from "../lib/alchemy";
import * as DBPedia from "../lib/dbpedia/search";
import * as googlesearch from "../lib/googlesearch";
import * as McdIOSphere from "../lib/mcd-iosphere";
import * as spotlight from "../lib/spotlight";

/**
 * Returns a list of spotlight URLs related to the query.
 *
 * @param query
 * @returns {Promise<string[]>}
 */
export async function search (query: string): Promise<string[]> {
  console.log("QUERYING...");
  const searchResults: googlesearch.SearchResult[] = await googlesearch.search({query: query});
  console.log(searchResults);
  console.log("ALCHEMYING...");
  // TODO: handle empty array
  const alchemyResult: alchemy.Result = await alchemy.getTextFromURL(searchResults[0].link);
  console.log(alchemyResult);
  console.log("SPOTLIGHTING...");
  const spotlightResult: string[] = await spotlight.query(alchemyResult.text, alchemyResult.language);
  console.log(spotlightResult);
  return spotlightResult;
}

function buildGooglesearchQuery(userQuery: string): string {
  // TODO: configuration options
  return `${userQuery} manga OR anime site:en.wikipedia.org`;
}

/**
 * A test pipeline using specific search.
 */
export async function search2 (query: string): Promise<apiInterfaces.search.SearchResult[]> {
  const googlesearchQuery: string = buildGooglesearchQuery(query);
  const searchResults: googlesearch.SearchResult[] = await googlesearch.search({query: googlesearchQuery});
  console.log("Google results");
  console.log(searchResults);
  const dirtyResults: (apiInterfaces.search.SearchResult | null)[] = await Promise.all(searchResults
    .slice(0, 3)
    .map(async (searchResult: googlesearch.SearchResult): Promise<apiInterfaces.search.SearchResult | null> => {
      const url: string = searchResult.link;
      const resourceIri: string = "" + url; // DBPedia.wikipediaArticleUrlToResourceUrl(url);
      const result: apiInterfaces.search.SearchResult | null = await DBPedia.search(resourceIri);
      if (result === null) {
        return null;
      }

      // Resolve cover
      if (result.type === "manga") {
        try {
          const cover: MangaCover = await McdIOSphere.getMangaCoverUrl(result.title); // resourceToName
          result.coverUrl = cover.coverUrl;
        } catch (err) {
          // Ignore undefined cover
          // TODO: try to get something with anilist ?
        }
      }
      return result;
    }));

  const results: apiInterfaces.search.SearchResult[] = [];
  for (const result of dirtyResults) {
    if (result !== null) {
      results.push(result);
    }
  }
  return results;
}
