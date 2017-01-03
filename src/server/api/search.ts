import * as _ from "lodash";
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
  return `${userQuery} manga OR anime`;
}

async function getResources(uri: string): Promise<string[]> {
  console.log("Alchemy");
  const alchemyResult: alchemy.Result = await alchemy.getTextFromURL(uri);
  console.log("Alchemy result:");
  console.log(alchemyResult);
  console.log("Spotlight");
  const spotlightResult: string[] = await spotlight.query(alchemyResult.text, alchemyResult.language);
  console.log("Spotlight result:");
  console.log(spotlightResult);
  return spotlightResult;
}

/**
 * A test pipeline using specific search.
 */
export async function search2 (query: string): Promise<apiInterfaces.search.SearchResult[]> {
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
      cleanedResults.push(result);
    }
  }
  console.log("Final results:");
  console.log(cleanedResults);

  return cleanedResults;
}
