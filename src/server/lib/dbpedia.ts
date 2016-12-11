import * as Bluebird  from 'bluebird';
import * as request   from 'request-promise';
import * as _         from 'lodash';

import {Manga}      from "../../lib/interfaces/manga.interface";
import {Anime}      from "../../lib/interfaces/anime.interface";
import {Character}  from "../../lib/interfaces/character.interface";
import {Author}     from "../../lib/interfaces/author.interface";

/**
 * Redeclare types to avoid conflict with the following namespace.
 */
type MangaType = Manga;
type AnimeType = Anime;
type CharacterType = Character;
type AuthorType = Author;

/**
 * This namespace contains all functions needed by our app.
 * It's divided in sub-namespaces for more accuracy.
 * Each sub-namespace has a function retrieve(name: string)
 * gathering all available information.
 * For more specific work, please refer to other functions.
 */
export namespace DBPedia {

  /**
   * All functions related to mangas.
   */
  export namespace Manga {

    /**
     * Returns all available information about the manga 'name'.
     * @param name The manga's name.
     */
    export function retrieve(name: string): Bluebird<Manga> {
      let manga: MangaType;
      return getInfos(name)
        .then((infos: any) => {
          let authorName = infos.author;
          delete infos.author;
          manga = infos;
          return Author.retrieve(authorName);
        })
        .then((author: AuthorType) => {
          manga.author = author;
          return manga;
          // TODO: retrieve coverURL
        })
        .catch((err: any) => {
          return Bluebird.reject(err);
        })
    }

    /**
     * Returns basic information about the manga 'mangaName'.
     * @param mangaName The manga's name.
     * @param lang The lang in which the abstract is wanted. Default to english.
     */
    // TODO: type this
    export function getInfos(mangaName: string, lang: string = 'en'): Bluebird<any> {
      let query: string = "select distinct ?title ?author ?volumes ?publicationDate ?illustrator ?publisher ?abstract "
        + "where {"
        + "values ?title {dbr:" + mangaName + "}. "
        + "?title a dbo:Manga. "
        + "OPTIONAL { ?title dbo:author ?author }. "
        + "OPTIONAL { ?title dbo:numberOfVolumes ?volumes }. "
        + "OPTIONAL { ?title dbo:firstPublicationDate ?publicationDate }. "
        + "OPTIONAL { ?title dbo:illustrator ?illustrator }. "
        + "OPTIONAL { ?title dbo:publisher ?publisher }. "
        + "OPTIONAL { ?title dbo:abstract ?abstract. filter(langMatches(lang(?abstract),'" + lang +"')) }. "
        + "}";
      return request({
        url: "https://dbpedia.org/sparql?query=" + query + "&format=application/json",
        json: true
      })
      .then((body: any) => {
        return sparqlToManga(crossArray(body["results"]["bindings"]));
      })
      .catch((err: any) => {
        return Bluebird.reject(err);
      });
    }
  }

  /**
   * All functions related to animes.
   */
  export namespace Anime {

    /**
     * Returns all available information about the anime 'name'.
     * @param name The anime's name.
     */
    export function retrieve(name: string): Bluebird<Anime> {
      return Bluebird.reject(new Error("This function is not implemented yet"));
    }
  }

  /**
   * All functions related to animes' or mangas' characters.
   */
  export namespace Character {

    /**
     * Returns all available information about the character 'name'.
     * @param name The character's name.
     */
    export function retrieve(name: string): Bluebird<Character> {
      return Bluebird.reject(new Error("This function is not implemented yet"));
    }
  }

  /**
   * All functions related to
   */
  export namespace Author {

    /**
     * Returns all available information about the author 'name'.
     * @param name The author's name.
     */
    // TODO: for the moment, only wraps the given name in an object.
    export function retrieve(name: string): Bluebird<Author> {
      return Bluebird.resolve({name: name});
    }
  }

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
  // TODO: find a way to type the following variable as Manga without throwing a typescript error
  let manga: any = {};
  for(let key in sparqlResult) {
    if (!sparqlResult.hasOwnProperty(key)) continue;
    if(sparqlResult[key].length === 1) {
      manga[key] = (<any>sparqlResult[key][0]);
    } else if(key === "publicationDate") {
      manga[key] = _.min(sparqlResult[key]);
    } else if(key === "author") {
      manga[key] = sparqlResult[key][0];
    } else if(key === "snippet") {
      manga[key] = sparqlResult[key][0];
    } else if(key === "volumes") {
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
  let res: any = {};
  let first: boolean = true;
  for(let object of sparqlResult) {
    for(let key in object) {
      if (!object.hasOwnProperty(key)) continue;
      if(first) {
        res[key] = [object[key]["value"]];
      } else {
        if(res[key].indexOf(object[key]["value"]) !== -1) continue;
        res[key].push(object[key]["value"]);
      }
    }
    first = false;
  }
  return res;
}