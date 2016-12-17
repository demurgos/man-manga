import * as _ from "lodash";
import {Anime} from "../../lib/interfaces/anime.interface";
import {Author} from "../../lib/interfaces/author.interface";
import {Character} from "../../lib/interfaces/character.interface";
import * as io from "../../lib/interfaces/io";
import {Manga} from "../../lib/interfaces/manga.interface";
import requestIO from "./request-io";

// Each exported function retrieves data about an item
// For more specific work, please refer to other functions.

/**
 * Returns all available information about the manga 'name'.
 * @param mangaName The manga's name.
 */
export async function retrieveManga(mangaName: string): Promise<Manga> {
  const infos: any = await getMangaInfos(mangaName);
  const authorName: string = infos.author;
  delete infos.author;
  const manga: Manga = infos;
  manga.author = await retrieveAuthor(authorName);
  return manga;
}

/**
 * Returns basic information about the manga 'mangaName'.
 * @param mangaName The manga's name.
 * @param lang The lang in which the abstract is wanted. Default to english.
 */
// TODO: type this
export async function getMangaInfos(mangaName: string, lang: string = "en"): Promise<any> {
  const query: string = `SELECT DISTINCT ?title ?author ?volumes ?publicationDate ?illustrator ?publisher ?abstract
    WHERE {
    values ?title {dbr:${mangaName}}.
    ?title A dbo:Manga.
    OPTIONAL { ?title dbo:author ?author }.
    OPTIONAL { ?title dbo:numberOfVolumes ?volumes }.
    OPTIONAL { ?title dbo:firstPublicationDate ?publicationDate }.
    OPTIONAL { ?title dbo:illustrator ?illustrator }.
    OPTIONAL { ?title dbo:publisher ?publisher }.
    OPTIONAL { ?title dbo:abstract ?abstract. filter(langMatches(lang(?abstract),'${lang}')) }. 
    }`;

  const response: io.Response = await requestIO.get({
    uri: "https://dbpedia.org/sparql",
    queryString: {
      query: query,
      format: "application/json"
    }
  });

  const data: any = JSON.parse(response.body);

  return sparqlToManga(crossArray(data.results.bindings));
}

/**
 * Returns all available information about the anime 'name'.
 * @param animeName The anime's name.
 */
export async function retrieveAnime(animeName: string): Promise<Anime> {
  throw new Error("This function is not implemented yet");
}

/**
 * Returns all available information about the character 'name'.
 * @param name The character's name.
 */
export async function retrieveCharacter(name: string): Promise<Character> {
  throw new Error("This function is not implemented yet");
}

/**
 * Returns all available information about the author 'name'.
 * @param name The author's name.
 */
// TODO: for the moment, only wraps the given name in an object.
export async function retrieveAuthor(name: string): Promise<Author> {
  return {name: name};
}

/**
 * Transforms an object coming from a sparql request's response
 * into a manga.
 * It's fairly recommended to process the function crossArray
 * on the result BEFORE passing it to this function.
 * @param sparqlResult The result coming from a response to a sparql request.
 */
function sparqlToManga(sparqlResult: any): Manga {
  sparqlResult = sparqlResult.length !== undefined ? sparqlResult[0] : sparqlResult;
  // TODO: collect properties first and then build manga
  // Previous comment: find a way to type the following variable as Manga without throwing a typescript error
  const manga: Manga = <any> {};
  for (const key in sparqlResult) {
    if (!sparqlResult.hasOwnProperty(key)) {
      continue;
    }

    // TODO: document the expected keys
    if (sparqlResult[key].length === 1) {
      manga[key] = (<any> sparqlResult[key][0]);
    } else if (key === "publicationDate") {
      manga[key] = _.min(sparqlResult[key]);
    } else if (key === "author") {
      manga[key] = sparqlResult[key][0];
    } else if (key === "snippet") {
      manga[key] = sparqlResult[key][0];
    } else if (key === "volumes") {
      manga[key] = _.max(sparqlResult[key]);
    } else {
      manga[key] = sparqlResult[key];
    }
  }
  return manga;
}

/**
 * Transform an array of same type objects in a object with arrays as fields,
 * deleting duplicated values in the process.
 * @param sparqlResult The raw result sent by dbpedia.
 */
function crossArray(sparqlResult: any[]): any {
  const result: any = {};
  let first: boolean = true;
  for (const object of sparqlResult) {
    for (const key in object) {
      if (!object.hasOwnProperty(key)) {
        continue;
      }

      // TODO: simplify
      if (first) {
        result[key] = [object[key].value];
      } else {
        if (result[key].indexOf(object[key].value) !== -1) {
          continue;
        }
        result[key].push(object[key].value);
      }
    }

    first = false;
  }

  return result;
}
