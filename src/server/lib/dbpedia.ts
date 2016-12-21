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
   * The base URL to access dbpedia.
   */
  export const BASE_URL: string = "http://dbpedia.org";

  /**
   * The base URL to access any dbpedia resource.
   */
  export const BASE_RESOURCE_URL: string = BASE_URL + "/resource";

  /**
   * All functions needed when we don't know the resource's type.
   */
  export namespace Search {

    /**
     * Returns basic information about the resource 'name'.
     * TODO: atm, only search for manga or author.
     * @param name The resource's name.
     * @param lang The lang in which information are wanted. Default to english.
     */
    export function search(name: string, lang: string = 'en'): Bluebird<any> {
      let query: string = "SELECT ?title ?x ?author ?volumes ?publicationDate ?illustrator ?publisher ?abstract "
        + "where {"
        + "{"
          + "values ?title {<" + Utils.stringToResourceUrl(name) + ">}. "
          + "bind(exists { ?title a dbo:Manga. } as ?is)."
          + "bind(IF(?is=1, 'manga', 0) as ?x)."
          + "OPTIONAL { ?title dbo:author ?author }."
          + "OPTIONAL { ?title dbo:numberOfVolumes ?volumes }."
          + "OPTIONAL { ?title dbo:firstPublicationDate ?publicationDate }."
          + "OPTIONAL { ?title dbo:illustrator ?illustrator }."
          + "OPTIONAL { ?title dbo:publisher ?publisher }."
          + "OPTIONAL { ?title dbo:abstract ?abstract. filter(langMatches(lang(?abstract),'" + lang +"')) }."
        + "} UNION {"
          + "values ?title {<" + Utils.stringToResourceUrl(name) + ">}. "
          + "bind(exists { ?title a dbo:Author. } as ?is)." // TODO: correct this
          + "bind(IF(?is=1, 'author', 0) as ?x)."
        + "} filter(?is != 0). } ";
      return request({
        url: "https://dbpedia.org/sparql?query=" + query + "&format=application/json",
        json: true
      })
      .then((body: any) => {
        console.log(body["results"]["bindings"]);
        return sparqlToObjects(body["results"]["bindings"]);
      })
      .catch((err: any) => {
        return Bluebird.reject(err);
      });
    }
  }

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
        })
        .catch((err: any) => {
          return Bluebird.reject(err);
        });
    }

    /**
     * Returns basic information about the manga 'mangaName'.
     * @param mangaName The manga's name.
     * @param lang The lang in which the abstract is wanted. Default to english.
     */
    // TODO: type this
    export function getInfos(mangaName: string, lang: string = 'en'): Bluebird<any> {
      console.log(Utils.stringToResourceUrl(mangaName));
      let query: string = "select distinct ?title ?author ?volumes ?publicationDate ?illustrator ?publisher ?abstract "
        + "where {"
        + "values ?title {<" + Utils.stringToResourceUrl(mangaName) + ">}. "
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

  /**
   * All functions needed to performs treatments
   * on resources, results... and so on.
   */
  export namespace Utils {

    /**
     * Transforms a given string into a string following DBPedia
     * resources naming conventions.
     * BEWARE: Some resource can be a name which doesn't follow these
     * conventions. See Planetarian:_The_Reverie_of_a_Little_Planet.
     * To take account of such resources, string given with an underscore
     * and no space will already be considered as valid resources.
     * @param name The string to transform into a DBPedia resource string.
     */
    export function stringToResourceName(name: string): string {
      if(name.match(/_/g)) {
        return name
          .replace(/^\s+/g, '')
          .replace(/\s+/g, '_');
      }
      return name
        .toLowerCase()
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter: string) => {
          return letter.toUpperCase();
        })
        .replace(/^\s+/g, '')
        .replace(/\s+/g, '_');
    }

    /**
     * Transforms a given string into an URL string following DBPedia
     * resources naming conventions.
     * If the string is already an URL, this function returns
     * the given string without any modification.
     * BEWARE: Some resources can have a name which doesn't follow these
     * conventions. See Planetarian:_The_Reverie_of_a_Little_Planet.
     * To take account of such resources, string given with an underscore
     * and no space will already be considered as valid resources.
     * @param name The string to transform into a DBPedia resource string.
     */
    export function stringToResourceUrl(name: string): string {
      return name.match(new RegExp("^http://(.*)")) == null ?
      encodeURI(BASE_RESOURCE_URL + "/" + stringToResourceName(name)) :
      encodeURI(name);
    }
  }
}

function sparqlToObjects(sparqlResult: any): any {
  console.log("CROSS ARRAY:");
  console.log(sparqlResult);
  let res: any = {
    manga: null,
    anime: null,
    author: null,
    character: null
  };
  let tabRes: any[] = [[], [], [], []];
  for(let result of sparqlResult) {
    console.log(result);
    if (result["x"]["value"] == 'manga') {
      delete result["x"];
      tabRes[0].push(result);
    } else if (result["x"]["value"] == 'anime') {
      tabRes[1].push(result);
    } else if (result["x"]["value"] == 'author') {
      tabRes[2].push(result);
    } else if (result["x"]["value"] == 'character') {
      tabRes[3].push(result);
    }
  }
  console.log(tabRes);
  if(tabRes[0].length !== 0) {
    res.manga = sparqlToManga(crossArray(tabRes[0]));
  }
  if(tabRes[1].length !== 0) {
    res.anime = sparqlToAnime(crossArray(tabRes[1]));
  }
  if(tabRes[2].length !== 0) {
    res.author = sparqlToAuthor(crossArray(tabRes[2]));
  }
  if(tabRes[3].length !== 0) {
    res.character = sparqlToCharacter(crossArray(tabRes[3]));
  }
  return res;
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

function sparqlToAnime(sparqlResult: any): Anime {
  sparqlResult = sparqlResult.length !== undefined ? sparqlResult[0] : sparqlResult;
  // TODO: find a way to type the following variable as Manga without throwing a typescript error
  let anime: any = {};
  for(let key in sparqlResult) {
    if (!sparqlResult.hasOwnProperty(key)) continue;
    if(sparqlResult[key].length === 1) {
      anime[key] = (<any>sparqlResult[key][0]);
    }
  }
  return anime;
}

function sparqlToAuthor(sparqlResult: any): Author {
  sparqlResult = sparqlResult.length !== undefined ? sparqlResult[0] : sparqlResult;
  // TODO: find a way to type the following variable as Manga without throwing a typescript error
  let author: any = {};
  for(let key in sparqlResult) {
    if (!sparqlResult.hasOwnProperty(key)) continue;
    if(sparqlResult[key].length === 1 && key === "title") {
      author["name"] = (<any>sparqlResult[key][0]);
    } else if(sparqlResult[key].length === 1) {
      author[key] = (<any>sparqlResult[key][0]);
    }
  }
  return author;
}

function sparqlToCharacter(sparqlResult: any): Author {
  sparqlResult = sparqlResult.length !== undefined ? sparqlResult[0] : sparqlResult;
  // TODO: find a way to type the following variable as Manga without throwing a typescript error
  let author: any = {};
  for(let key in sparqlResult) {
    if (!sparqlResult.hasOwnProperty(key)) continue;
    if(sparqlResult[key].length === 1 && key === "title") {
      author["name"] = (<any>sparqlResult[key][0]);
    } else if(sparqlResult[key].length === 1) {
      author[key] = (<any>sparqlResult[key][0]);
    }
  }
  return author;
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