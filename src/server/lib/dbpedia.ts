import * as Bluebird  from 'bluebird';
import * as request   from 'request-promise';
import * as _         from 'lodash';

import {Manga as MangaType}         from "../../lib/interfaces/manga.interface";
import {Anime as AnimeType}         from "../../lib/interfaces/anime.interface";
import {Character as CharacterType} from "../../lib/interfaces/character.interface";
import {Author as AuthorType}       from "../../lib/interfaces/author.interface";

// TODO: typings need to be remastered for this file - beware, it's kinda hard
// Potential fix: use interfaces RawManga, RawAnime...

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
     * A result from a dbpedia search request.
     */
    export interface Result {
      manga?: MangaType;
      anime?: AnimeType;
      author?: AuthorType;
      character?: CharacterType;
    }

    /**
     * Result from a DBPedia sparql query,
     * in a raw shape.
     */
    export interface RawResult {
      x?: string;               // "manga", "anime" and so on
      title?: string;           // Anime/Manga's title or people's name
      author?: string;          // Author of the manga/anime
      volumes?: number;         // Number of volumes or episodes
      publicationDate?: string; // First volume/episode publication date or people's birthday
      illustrator?: string;     // Illustrator of the manga/anime
      publisher?: string;       // Publisher's name
      abstract?: string;        // Manga/Anime's abstract or snippet about people
    }

    /**
     * Returns basic information about the resource 'name'.
     * TODO: atm, only search for manga or author.
     * @param name The resource's name.
     * @param lang The lang in which information are wanted. Default to english.
     */
    export function search(name: string, lang: string = 'en'): Bluebird<Result> {
      let query: string = "SELECT ?title ?x ?author ?volumes ?publicationDate ?illustrator ?publisher ?abstract "
        + "where {"
        + "{"
          + "values ?title {<" + Utils.resourceToResourceUrl(name) + ">}. "
          + "bind(exists { ?title a dbo:Manga. } as ?is)."
          + "bind(IF(?is=1, 'manga', 0) as ?x)."
          + "OPTIONAL { ?title dbo:author ?author }."
          + "OPTIONAL { ?title dbo:numberOfVolumes ?volumes }."
          + "OPTIONAL { ?title dbo:firstPublicationDate ?publicationDate }."
          + "OPTIONAL { ?title dbo:illustrator ?illustrator }."
          + "OPTIONAL { ?title dbo:publisher ?publisher }."
          + "OPTIONAL { ?title dbo:abstract ?abstract. filter(langMatches(lang(?abstract),'" + lang +"')) }."
        + "} UNION {"
          + "values ?title {<" + Utils.resourceToResourceUrl(name) + ">}. "
          + "bind(exists { ?m a dbo:Manga. ?m dbo:author ?title. } as ?is)."
          + "bind(IF(?is=1, 'author', 0) as ?x)."
        + "} filter(?is != 0). } ";
      return request({
        url: "https://dbpedia.org/sparql?query=" + query + "&format=application/json",
        json: true
      })
      .then((body: any) => {
        console.log(body["results"]["bindings"]);
        let res = DBPediaTransform.sparqlToObjects(body["results"]["bindings"]);
        const mres = res.manga;
        // NB: need a const variable (!= immutable) to be sure that condition will still be OK after promise - typescript
        if(mres && mres.author) {
          let authorName: any = mres.author;
          return Author
            .retrieve(authorName)
            .then((author: AuthorType) => {
              mres.author = author;
              res.manga = mres;
              return res;
            });
        }
        // TODO: do the same for other potential results
        return res;
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

    import RawResultArray = DBPediaTransform.RawResultArray;
    /**
     * Returns all available information about the manga 'name'.
     * @param name The manga's name.
     */
    export function retrieve(name: string): Bluebird<MangaType> {
      let manga: MangaType;
      return getInfos(name)
        .then((infos: any) => {
          if(infos.author) {
            let authorName = infos.author;
            delete infos.author;
            manga = infos;
            return Author
              .retrieve(authorName)
              .then((author: AuthorType) => {
                manga.author = author;
                return manga;
              });
          }
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
    export function getInfos(mangaName: string, lang: string = 'en'): Bluebird<MangaType> {
      let query: string = "select distinct ?title ?author ?volumes ?publicationDate ?illustrator ?publisher ?abstract "
        + "where {"
        + "values ?title {<" + Utils.resourceToResourceUrl(mangaName) + ">}. "
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
        return DBPediaTransform.sparqlToManga(DBPediaTransform.crossArray(body["results"]["bindings"]));
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
    export function retrieve(name: string): Bluebird<AnimeType> {
      let anime: AnimeType;
      return getInfos(name)
        .then((infos: any) => {
          if(infos.author) {
            let authorName = infos.author;
            delete infos.author;
            anime = infos;
            return Author
              .retrieve(authorName)
              .then((author: AuthorType) => {
                anime.author = author;
                return anime;
              });
          }
          return anime;
        })
        .catch((err: any) => {
          return Bluebird.reject(err);
        });
    }

    /**
     * Returns basic information about the anime 'animeName'.
     * @param animeName The anime's name.
     * @param lang The lang in which the abstract is wanted. Default to english.
     */
    export function getInfos(animeName: string, lang: string = 'en'): Bluebird<AnimeType> {
      let query: string = "select distinct ?title ?author ?abstract "
        + "where {"
        + "values ?title {<" + Utils.resourceToResourceUrl(animeName) + ">}. "
        + "?title a dbo:Anime. "
        + "OPTIONAL { ?title dbo:writer ?author }. "
        // TODO: dbo:numberOfEpisodes via dbr:List_of_<resource>_episodes
        + "OPTIONAL { ?title dbo:abstract ?abstract. filter(langMatches(lang(?abstract),'" + lang +"')) }. "
        + "}";
      return request({
        url: "https://dbpedia.org/sparql?query=" + query + "&format=application/json",
        json: true
      })
      .then((body: any) => {
        return DBPediaTransform.sparqlToAnime(DBPediaTransform.crossArray(body["results"]["bindings"]));
      })
      .catch((err: any) => {
        return Bluebird.reject(err);
      });
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
    export function retrieve(name: string): Bluebird<CharacterType> {
      let character: CharacterType;
      return getInfos(name)
        .then((infos: any) => {
          if(infos.creator) {
            let authorName = infos.creator;
            delete infos.creator;
            character = infos;
            return Author
              .retrieve(authorName)
              .then((author: AuthorType) => {
                character.creator = author;
                return character;
              });
          }
          return character;
        })
        .catch((err: any) => {
          return Bluebird.reject(err);
        });
    }

    /**
     * Returns basic information about the character 'characterName'.
     * @param characterName The character's name.
     * @param lang The lang in which the abstract is wanted. Default to english.
     */
    export function getInfos(characterName: string, lang: string = 'en'): Bluebird<CharacterType> {
      let query: string = "select distinct ?title ?author ?abstract "
        + "where {"
        + "values ?title {<" + Utils.resourceToResourceUrl(characterName) + ">}. "
        + "?title a dbo:FictionalCharacter. "
        + "OPTIONAL { ?title dbo:creator ?author }. "
        // TODO: dbo:voiceActor
        + "OPTIONAL { ?title dbo:abstract ?abstract. filter(langMatches(lang(?abstract),'" + lang +"')) }. "
        + "}";
      return request({
        url: "https://dbpedia.org/sparql?query=" + query + "&format=application/json",
        json: true
      })
      .then((body: any) => {
        return DBPediaTransform.sparqlToCharacter(DBPediaTransform.crossArray(body["results"]["bindings"]));
      })
      .catch((err: any) => {
        return Bluebird.reject(err);
      });
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
    export function retrieve(name: string): Bluebird<AuthorType> {
      return getInfos(name)
        .catch((err: any) => {
          return Bluebird.reject(err);
        });
    }

    /**
     * Returns basic information about the author 'authorName'.
     * @param authorName The author's name.
     * @param lang The lang in which the abstract is wanted. Default to english.
     */
    export function getInfos(authorName: string, lang: string = 'en'): Bluebird<AuthorType> {
      let query: string = "select distinct ?title ?abstract ?employer ?birthDate "
        + "where { "
        + "values ?title {<" + Utils.resourceToResourceUrl(authorName) + ">}. "
        + "{ ?m a dbo:Manga. ?m dbo:author ?title. } "
        + "UNION "
        + "{ ?m a dbo:Anime. ?m dbo:writer ?title. } "
        // TODO: add author's work into interfaces and query
        + "OPTIONAL { ?title dbo:employer ?employer }. "
        + "OPTIONAL { ?title dbo:birthDate ?birthDate }. "
        + "OPTIONAL { ?title dbo:abstract ?abstract. filter(langMatches(lang(?abstract),'" + lang +"')) }. "
        + "}";
      return request({
        url: "https://dbpedia.org/sparql?query=" + query + "&format=application/json",
        json: true
      })
      .then((body: any) => {
        return DBPediaTransform.sparqlToAuthor(DBPediaTransform.crossArray(body["results"]["bindings"]));
      })
      .catch((err: any) => {
        return Bluebird.reject(err);
      });
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

    /**
     * Transforms a given string into an URL string.
     * To be a valid DBPedia resource's URL, the resource's name
     * must be a valid one.
     * If the resource is already an URL,
     * this function just encodes it.
     * @param name The valid name of the resource.
     */
    export function resourceToResourceUrl(name: string): string {
      let regex = new RegExp("^" + BASE_RESOURCE_URL + "(.*)");
      return name.match(regex) ?
        encodeURI(name): encodeURI(BASE_RESOURCE_URL + "/" + name);
    }

    /**
     * Transforms a given URL into a resource string.
     * To be a valid DBPedia resource's name, the resource's URL
     * must be a valid one.
     * @param url The valid resource's URL.
     */
    export function resourceUrlToResource(url: string): string {
      return url.replace(new RegExp(BASE_RESOURCE_URL + "(.*)"), "$1");
    }

    /**
     * Transforms a given URL into a name string.
     * @param url The valid resource's URL.
     */
    export function resourceUrlToName(url: string): string {
      return resourceUrlToResource(url).replace('_', ' ');
    }
  }
}

/**
 * Private namespace for this file,
 * containing all needed function to process results.
 */
namespace DBPediaTransform {

  /**
   * Transform a sparql raw search result into a usable search result.
   * @param sparqlResult The raw sparql result.
   */
  // TODO: refactor this
  export function sparqlToObjects(sparqlResult: any): DBPedia.Search.Result {
    console.log("CROSS ARRAY:");
    console.log(sparqlResult);
    let res: DBPedia.Search.Result = {
      manga: undefined,
      anime: undefined,
      author: undefined,
      character: undefined
    };
    let tabRes: any[] = [[], [], [], []];
    for(let result of sparqlResult) {
      console.log(result);
      if (result["x"]["value"] == 'manga') {
        tabRes[0].push(result);
      } else if (result["x"]["value"] == 'anime') {
        tabRes[1].push(result);
      } else if (result["x"]["value"] == 'author') {
        tabRes[2].push(result);
      } else if (result["x"]["value"] == 'character') {
        tabRes[3].push(result);
      }
      delete result["x"];
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
   * @param sparqlResult The result coming from a response to a sparql request.
   */
  export function sparqlToManga(sparqlResult: RawResultArray): MangaType {
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
      } else if(key === "abstract") {
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
   * Transforms an object coming from a sparql request's response
   * into a anime.
   * @param sparqlResult The result coming from a response to a sparql request.
   */
  export function sparqlToAnime(sparqlResult: RawResultArray): AnimeType {
    // TODO: find a way to type the following variable as Anime without throwing a typescript error
    let anime: any = {};
    for(let key in sparqlResult) {
      if (!sparqlResult.hasOwnProperty(key)) continue;
      if(sparqlResult[key].length === 1) {
        anime[key] = (<any>sparqlResult[key][0]);
      } else if(key === "author") {
        anime[key] = sparqlResult[key][0];
      } else if(key === "abstract") {
        anime[key] = sparqlResult[key][0];
      }
    }
    return anime;
  }

  /**
   * Transforms an object coming from a sparql request's response
   * into an author.
   * @param sparqlResult The result coming from a response to a sparql request.
   */
  export function sparqlToAuthor(sparqlResult: RawResultArray): AuthorType {
    // TODO: find a way to type the following variable as Author without throwing a typescript error
    let author: any = {};
    for(let key in sparqlResult) {
      if (!sparqlResult.hasOwnProperty(key)) continue;
      if(sparqlResult[key].length === 1 && key === "title") {
        author["name"] = (<any>sparqlResult[key][0]);
      } else if(sparqlResult[key].length === 1) {
        author[key] = (<any>sparqlResult[key][0]);
      } else if(key === "abstract") {
        author[key] = sparqlResult[key][0];
      } else if(key === "employer") {
        author[key] = sparqlResult[key][0];
      }
    }
    return author;
  }

  /**
   * Transforms an object coming from a sparql request's response
   * into a character.
   * @param sparqlResult The result coming from a response to a sparql request.
   */
  export function sparqlToCharacter(sparqlResult: RawResultArray): AuthorType {
    // TODO: find a way to type the following variable as Character without throwing a typescript error
    let character: any = {};
    for(let key in sparqlResult) {
      if (!sparqlResult.hasOwnProperty(key)) continue;
      if(sparqlResult[key].length === 1 && key === "title") {
        character["name"] = (<any>sparqlResult[key][0]);
      } else if(sparqlResult[key].length === 1 && key == "author") {
        character["creator"] = (<any>sparqlResult[key][0]);
      } else if (sparqlResult[key].length === 1) {
        character[key] = (<any>sparqlResult[key][0]);
      } else if(key === "abstract") {
        character[key] = sparqlResult[key][0];
      } else if(key === "author") {
        character["creator"] = sparqlResult[key][0];
      }
    }
    return character;
  }

  /**
   * Transform an array of same type objects in a object with arrays as fields,
   * deleting duplicated values in the process.
   * @param sparqlResult The raw result sent by dbpedia.
   */
  export function crossArray(sparqlResult: any[]): RawResultArray {
    // TODO: find a way to type the following variable without typescript throwing an error
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
    return <RawResultArray>res;
  }

  /**
   * A sparql raw result array transformed into a single object.
   */
  export interface RawResultArray {
    x: string[];               // "manga", "anime" and so on
    title: string[];           // Anime/Manga's title or people's name
    author: string[];          // Author of the manga/anime
    volumes: number[];         // Number of volumes or episodes
    publicationDate: string[]; // First volume/episode publication date or people's birthday
    illustrator: string[];     // Illustrator of the manga/anime
    publisher: string[];       // Publisher's name
    abstract: string[];        // Manga/Anime's abstract or snippet about people
    [key: string]: any[];      // To use syntax obj["key"]
  }
}