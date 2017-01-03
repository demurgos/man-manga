import * as url from "url";
import * as io from "../../../lib/interfaces/io";
import requestIO from "../request-io";
import * as sparql from "./sparql";

/**
 * The base URL to access wikipedia (english).
 */
export const wikipediaBaseUrl: string = "https://en.wikipedia.org/wiki/";

/**
 * The base URL to access dbpedia.
 */
export const dbpediaBaseUrl: string = "http://dbpedia.org/";

/**
 * The base URL to access any dbpedia resource.
 */
export const dbpediaResourceBaseUrl: string = `${dbpediaBaseUrl}resource/`;

/**
 * The URI of the Sparql API of DBPedia
 */
export const dbpediaSparqlUri: string = url.resolve(dbpediaBaseUrl, "sparql");

/**
 * Perform a Sparql SELECT query
 *
 * @param query
 * @param httpIO override the default `request`-based http requests library
 */
export async function selectQuery(query: string, httpIO: io.IO = requestIO): Promise<sparql.SelectResult> {
  const response: io.Response = await httpIO.get({
    uri: dbpediaSparqlUri,
    queryString: {
      query: query,
      format: "application/json"
    }
  });

  if (response.statusCode !== 200) {
    throw new Error("Unexpected status code for SPARQL query");
  }

  return JSON.parse(response.body);
}

/**
 * Merge (or rather reduce) an array of Sparql SELECT bindings to a single object (structure).
 * For each property:
 * - The key is a variable name from the query solution
 * - The value is the Set of unique strings of the `value` property of the RDF terms corresponding
 *   to this variable name.
 *
 * @param bindings
 * @returns {any}
 */
export function mergeSelectBindings(bindings: sparql.SelectBinding[]): {[varName: string]: Set<string>} {
  return toStructureOfSets(bindings.map(flattenSparqlBinding));
}

/**
 * Maps a Sparql SELECT binding by replacing its RDF terms with their `value` property.
 *
 * @param binding A Sparql SELECT binding
 */
export function flattenSparqlBinding(binding: sparql.SelectBinding): {[varName: string]: string} {
  const result: {[varName: string]: string} = {};
  for (const key in binding) {
    if (!binding.hasOwnProperty(key)) {
      continue;
    }
    result[key] = binding[key].value;
  }
  return result;
}

/**
 * Converts an array of structures to a structure of sets.
 *
 * Each property of the result object will be the set of unique values for this property for
 * the objects in the input array.
 *
 * This process is similar to an "Array of Structures" (AOS) to "Structure of Arrays" (SOA)
 * conversion (hence the word "structure" instead of "object"):
 * https://en.wikipedia.org/wiki/AOS_and_SOA
 *
 * @param arr The array of structures.
 */
export function toStructureOfSets<T>(arr: T[]): {[K in keyof T]: Set<T[K]>} {
  const result: {[K in keyof T]: Set<any>} = <any> {};
  for (const object of arr) {
    for (const key in object) {
      if (!object.hasOwnProperty(key)) {
        continue;
      }
      if (!(key in result)) {
        result[key] = new Set();
      }
      result[key].add(object[key]);
    }
  }

  return result;
}

// /**
//  * Transforms a given string into a string following DBPedia
//  * resources naming conventions.
//  * BEWARE: Some resource can be a name which doesn't follow these
//  * conventions. See Planetarian:_The_Reverie_of_a_Little_Planet.
//  * To take account of such resources, string given with an underscore
//  * and no space will already be considered as valid resources.
//  * @param name The string to transform into a DBPedia resource string.
//  */
// export function stringToResourceName(name: string): string {
//   if (name.match(/_/g)) {
//     return name
//       .replace(/^\s+/g, "")
//       .replace(/\s+/g, "_");
//   }
//   return name
//     .toLowerCase()
//     .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter: string) => {
//       return letter.toUpperCase();
//     })
//     .replace(/^\s+/g, "")
//     .replace(/\s+/g, "_");
// }
//
// /**
//  * Transforms a given string into an URL string following DBPedia
//  * resources naming conventions.
//  * If the string is already an URL, this function returns
//  * the given string without any modification.
//  * BEWARE: Some resources can have a name which doesn't follow these
//  * conventions. See Planetarian:_The_Reverie_of_a_Little_Planet.
//  * To take account of such resources, string given with an underscore
//  * and no space will already be considered as valid resources.
//  * @param name The string to transform into a DBPedia resource string.
//  */
// export function stringToResourceUrl(name: string): string {
//   if (name.match(new RegExp("^http://(.*)")) === null) {
//     return encodeURI(dbpediaResourceBaseUrl + stringToResourceName(name));
//   } else {
//     return encodeURI(name);
//   }
// }

/**
 * Transforms a given string into an URL string.
 * To be a valid DBPedia resource's URL, the resource's name
 * must be a valid one.
 * If the resource is already an URL,
 * this function just encodes it.
 *
 * @param name The valid name of the resource.
 */
export function resourceToResourceUrl(name: string): string {
  // TODO: fix this
  const regex: RegExp = new RegExp("^" + dbpediaResourceBaseUrl + "(.*)");
  return name.match(regex) ? encodeURI(name) : encodeURI(dbpediaResourceBaseUrl + name);
}

/**
 * Transforms a given URL into a resource string.
 * To be a valid DBPedia resource's name, the resource's URL
 * must be a valid one.
 * @param url The valid resource's URL.
 */
export function resourceUrlToResource(url: string): string {
  return url.replace(dbpediaResourceBaseUrl, "");
}

export function wikipediaArticleUrlToResource(url: string): string {
  return url.replace(wikipediaBaseUrl, "");
}

/**
 *
 * @param url
 * @returns {string}
 */
export function wikipediaArticleUrlToResourceUrl(url: string): string {
  return dbpediaResourceBaseUrl + wikipediaArticleUrlToResource(url);
}

/**
 * Transforms a given URL into a name string.
 * @param url The valid resource's URL.
 */
export function resourceUrlToName(url: string): string {
  return resourceUrlToResource(url).replace(/_+/g, " ");
}
