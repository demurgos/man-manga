import * as url from "url";
import * as io from "../../../lib/interfaces/io";
import requestIO from "../request-io";
import * as sparql from "./sparql";
import * as sparqlQuery from "./sparql-query";

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
  let response: io.Response;
  try {
    response = await httpIO.get({
      uri: dbpediaSparqlUri,
      queryString: {
        query: query,
        format: "application/json"
      }
    });
  } catch (err) {
    console.error(err);
    throw new Error("DbpediaHttpError");
  }

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

const labelPredicate: string = "http://www.w3.org/2000/01/rdf-schema#label";

export async function getLabel(resourceIri: string, lang: string = "en"): Promise<string> {
  const iriRefNode: sparqlQuery.IriRef = {type: "IriRef", value: resourceIri};
  const iriRefString: string = sparqlQuery.formatIriRef(iriRefNode);
  const labelIriRefNode: sparqlQuery.IriRef = {type: "IriRef", value: labelPredicate};
  const labelRefString: string = sparqlQuery.formatIriRef(labelIriRefNode);

  const labelVar: string = `?label`;

  const query: string = `
    SELECT DISTINCT
      ${labelVar}
    WHERE {
      ${iriRefString} ${labelRefString} ${labelVar}.
    }
  `;

  const sparqlResult: sparql.SelectResult = await selectQuery(query);
  return readLabel(sparqlResult, lang);
}

export function readLabel(sparqlResult: sparql.SelectResult, lang: string = "en"): string {
  const langToLabel: {[lang: string]: string} = {};

  for (const binding of sparqlResult.results.bindings) {
    if (!("label" in binding)) {
      continue;
    }
    const term: sparql.TaggedLiteral = <sparql.TaggedLiteral> binding["label"];
    if ("xml:lang" in term) {
      langToLabel[term["xml:lang"]] = term.value;
    }
  }

  if (lang in langToLabel) {
    return langToLabel[lang];
  } else {
    const preferredLangs: string[] = ["en", "fr", "ja", "es", "de"];
    for (const preferredLang of preferredLangs) {
      if (preferredLang in langToLabel) {
        return langToLabel[preferredLang];
      }
    }
  }
  return "";
}
