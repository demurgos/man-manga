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
 * A result from a dbpedia search request.
 */
export interface SearchResult {
  manga?: Manga;
  anime?: Anime;
  author?: Author;
  character?: Character;
}

/**
 * Result from a DBPedia sparql query,
 * in a raw shape.
 */
export interface SearchRawResult {
  /**
   * "manga", "anime" and so on
   */
  x?: string;

  /**
   * Anime/Manga's title or people's name
   */
  title?: string;

  /**
   * Author of the manga/anime
   */
  author?: string;

  /**
   * Number of volumes or episodes
   */
  volumes?: number;

  /**
   * First volume/episode publication date or people's birthday
   */
  publicationDate?: string;

  /**
   * Illustrator of the manga/anime
   */
  illustrator?: string;

  /**
   * Publisher's name
   */
  publisher?: string;

  /**
   * Manga/Anime's abstract or snippet about people
   */
    abstract?: string;
}

/**
 * Returns basic information about the resource 'name'.
 * TODO: atm, only search for manga or author.
 * @param name The resource's name.
 * @param lang The lang in which information are wanted. Default to english.
 */
export async function search(name: string, lang: string = "en"): Promise<SearchResult> {
  // TODO: dbo:numberOfEpisodes via dbr:List_of_<resource>_episodes
  // TODO: dbo:voiceActor
  const query: string = `
    SELECT
      ?title ?x ?author ?volumes ?publicationDate ?illustrator ?publisher ?abstract ?employer ?birthDate
    WHERE {
      {
        values ?title {<${resourceToResourceUrl(name)}>}.
        bind(exists { ?title a dbo:Manga. } as ?is).
        bind(IF(?is=1, 'manga', 0) as ?x).
        OPTIONAL { ?title dbo:author ?author }.
        OPTIONAL { ?title dbo:numberOfVolumes ?volumes }.
        OPTIONAL { ?title dbo:firstPublicationDate ?publicationDate }.
        OPTIONAL { ?title dbo:illustrator ?illustrator }.
        OPTIONAL { ?title dbo:publisher ?publisher }.
        OPTIONAL { ?title dbo:abstract ?abstract. filter(langMatches(lang(?abstract), '${lang}')) }.
      } UNION {
        values ?title {<${resourceToResourceUrl(name)}>}.
        bind(exists {?title a dbo:Anime.} as ?is).
        bind(IF(?is=1, 'anime', 0) as ?x).
        OPTIONAL { ?title dbo:writer ?author }.
        OPTIONAL { ?title dbo:abstract ?abstract. filter(langMatches(lang(?abstract), '${lang}')) }.
      } UNION {
        values ?title {<${resourceToResourceUrl(name)}>}.
        bind(exists {?title a dbo:FictionalCharacter.} as ?is).
        bind(IF(?is=1, 'character', 0) as ?x).
        OPTIONAL { ?title dbo:creator ?author }.
        OPTIONAL { ?title dbo:abstract ?abstract. filter(langMatches(lang(?abstract), '${lang}')) }.
      } UNION {
        values ?title {<${resourceToResourceUrl(name)}>}.
        bind(exists {?m a dbo:Manga. ?m dbo:author ?title.} as ?is).
        bind(IF(?is=1, 'author', 0) as ?x).
        OPTIONAL { ?title dbo:employer ?employer }.
        OPTIONAL { ?title dbo:birthDate ?birthDate }.
        OPTIONAL { ?title dbo:abstract ?abstract. filter(langMatches(lang(?abstract), '${lang}')) }.
      } UNION {
        values ?title {<${resourceToResourceUrl(name)}>}.
        bind(exists {?m a dbo:Anime. ?m dbo:writer ?title.} as ?is).
        bind(IF(?is=1, 'author', 0) as ?x).
        OPTIONAL { ?title dbo:employer ?employer }.
        OPTIONAL { ?title dbo:birthDate ?birthDate }.
        OPTIONAL { ?title dbo:abstract ?abstract. filter(langMatches(lang(?abstract), '${lang}')) }.
      }
      filter(?is != 0).
    }
  `;

  const response: io.Response = await requestIO.get({
    uri: "https://dbpedia.org/sparql",
    queryString: {
      query: query,
      format: "application/json"
    }
  });

  const data: any = JSON.parse(response.body);
  const res: SearchResult = sparqlToObjects(data["results"]["bindings"]);

  // NB: need a const variable (!= immutable) to be sure that condition will still be OK after promise - typescript
  // NOTE: for the moment, we assume that the resource can't be two things at once
  // (it's already true for mangas and animes)
  // TODO: character with the same name and other possible collisions
  // TODO: refactor the following code
  if (res.manga && res.manga.author) {
    const authorName: string = res.manga.author.name;
    res.manga.author = await retrieveAuthor(authorName);
    return res;
  }

  if (res.anime && res.anime.author) {
    const authorName: string = res.anime.author.name;
    res.anime.author = await retrieveAuthor(authorName);
    return res;
  }

  // Nothing to retrieve atm for authors
  if (res.character && res.character.creator) {
    const authorName: string = res.character.creator.name;
    res.character.creator = await retrieveAuthor(authorName);
    return res;
  }

  return res;
}

/**
 * Returns all available information about the manga 'mangaName'.
 *
 * @param mangaName The manga's name.
 */
export async function retrieveManga(mangaName: string): Promise<Manga> {
  const infos: Manga = await getMangaInfos(mangaName);
  const authorName: string = infos.author.name;
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
export async function getMangaInfos(mangaName: string, lang: string = "en"): Promise<Manga> {
  const query: string = `
    SELECT DISTINCT
      ?title ?author ?volumes ?publicationDate ?illustrator ?publisher ?abstract
    WHERE {
      values ?title {<${resourceToResourceUrl(mangaName)}>}.
      ?title A dbo:Manga.
      OPTIONAL { ?title dbo:author ?author }.
      OPTIONAL { ?title dbo:numberOfVolumes ?volumes }.
      OPTIONAL { ?title dbo:firstPublicationDate ?publicationDate }.
      OPTIONAL { ?title dbo:illustrator ?illustrator }.
      OPTIONAL { ?title dbo:publisher ?publisher }.
      OPTIONAL { ?title dbo:abstract ?abstract. filter(langMatches(lang(?abstract),'${lang}')) }. 
    }
  `;

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
  const animeInfos: Anime = await getAnimeInfos(animeName);
  if (animeInfos.author === undefined) {
    throw new Error("Missing author information");
  }
  const authorName: string = animeInfos.author.name;
  delete animeInfos.author;
  const anime: Anime = animeInfos;
  anime.author = await retrieveAuthor(authorName);
  return anime;
}

/**
 * Returns basic information about the anime 'animeName'.
 * @param animeName The anime's name.
 * @param lang The lang in which the abstract is wanted. Default to english.
 */
export async function getAnimeInfos(animeName: string, lang: string = "en"): Promise<Anime> {
  // TODO: dbo:numberOfEpisodes via dbr:List_of_<resource>_episodes
  const query: string = `
    SELECT DISTINCT
      ?title ?author ?abstract
    WHERE {
      values ?title {<${resourceToResourceUrl(animeName)}>}.
      ?title a dbo:Anime.
      OPTIONAL { ?title dbo:abstract ?abstract. filter(langMatches(lang(?abstract), '${lang}')) }.
    }
  `;

  const response: io.Response = await requestIO.get({
    uri: "https://dbpedia.org/sparql",
    queryString: {
      query: query,
      format: "application/json"
    }
  });
  const data: any = JSON.parse(response.body);
  return sparqlToAnime(crossArray(data.results.bindings));
}

/**
 * Returns all available information about the character 'name'.
 * @param characterName The character's name.
 */
export async function retrieveCharacter(characterName: string): Promise<Character> {
  const characterInfos: Character = await getCharacterInfos(characterName);
  if (characterInfos.creator === undefined) {
    return characterInfos;
  }

  const authorName: string = characterInfos.creator.name;
  delete characterInfos.creator;
  const character: Character = characterInfos;
  characterInfos.creator = await retrieveAuthor(authorName);
  return character;
}

/**
 * Returns basic information about the character 'characterName'.
 * @param characterName The character's name.
 * @param lang The lang in which the abstract is wanted. Default to english.
 */
export async function getCharacterInfos(characterName: string, lang: string = "en"): Promise<Character> {
  // TODO: dbo:voiceActor
  const query: string = `
    SELECT DISTINCT
      ?title ?author ?abstract
    where {
      values ?title {<${resourceToResourceUrl(characterName)}>}.
      ?title a dbo:FictionalCharacter.
      OPTIONAL { ?title dbo:creator ?author }.
      OPTIONAL { ?title dbo:abstract ?abstract. filter(langMatches(lang(?abstract), '${lang}')) }.
    }
  `;

  const response: io.Response = await requestIO.get({
    uri: "https://dbpedia.org/sparql",
    queryString: {
      query: query,
      format: "application/json"
    }
  });
  const data: any = JSON.parse(response.body);
  return sparqlToCharacter(crossArray(data.results.bindings));
}

/**
 * Returns all available information about the author 'name'.
 * @param name The author's name.
 */
// TODO: for the moment, only wraps the given name in an object.
export async function retrieveAuthor(name: string): Promise<Author> {
  return getAuthorInfos(name);
}

/**
 * Returns basic information about the author 'authorName'.
 * @param authorName The author's name.
 * @param lang The lang in which the abstract is wanted. Default to english.
 */
export async function getAuthorInfos(authorName: string, lang: string = "en"): Promise<Author> {
  // TODO: add author's work into interfaces and query
  const query: string = `
    SELECT DISTINCT
      ?title ?abstract ?employer ?birthDate
    WHERE {
      values ?title {<${resourceToResourceUrl(authorName)}>}.
      {
        ?m a dbo:Manga. ?m dbo:author ?title.
      } UNION {
       ?m a dbo:Anime. ?m dbo:writer ?title.
      OPTIONAL { ?title dbo:employer ?employer }.
      OPTIONAL { ?title dbo:birthDate ?birthDate }.
      OPTIONAL { ?title dbo:abstract ?abstract. filter(langMatches(lang(?abstract), '${lang}'))) }.
    }
  `;

  const response: io.Response = await requestIO.get({
    uri: "https://dbpedia.org/sparql",
    queryString: {
      query: query,
      format: "application/json"
    }
  });
  const data: any = JSON.parse(response.body);
  return sparqlToAuthor(crossArray(data.results.bindings));
}

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
  if (name.match(/_/g)) {
    return name
      .replace(/^\s+/g, "")
      .replace(/\s+/g, "_");
  }
  return name
    .toLowerCase()
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter: string) => {
      return letter.toUpperCase();
    })
    .replace(/^\s+/g, "")
    .replace(/\s+/g, "_");
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
  if (name.match(new RegExp("^http://(.*)")) === null) {
    return encodeURI(dbpediaResourceBaseUrl + stringToResourceName(name));
  } else {
    return encodeURI(name);
  }
}

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

export function wikiResourceUrlToResource(url: string): string {
  return url.replace(wikipediaBaseUrl, "");
}

/**
 *
 * @param url
 * @returns {string}
 */
export function wikiUrlToResourceUrl(url: string): string {
  return dbpediaResourceBaseUrl + wikiResourceUrlToResource(url);
}

/**
 * Transforms a given URL into a name string.
 * @param url The valid resource's URL.
 */
export function resourceUrlToName(url: string): string {
  return resourceUrlToResource(url).replace(/_+/g, " ");
}

/**
 * Transform a sparql raw search result into a usable search result.
 *
 * @param sparqlResult The raw sparql result.
 */
// TODO: refactor this
export function sparqlToObjects(sparqlResult: any): SearchResult {
  const res: SearchResult = {};

  const tabRes: any[] = [[], [], [], []];
  for (const result of sparqlResult) {
    if (result["x"]["value"] === "manga") {
      tabRes[0].push(result);
    } else if (result["x"]["value"] === "anime") {
      tabRes[1].push(result);
    } else if (result["x"]["value"] === "author") {
      tabRes[2].push(result);
    } else if (result["x"]["value"] === "character") {
      tabRes[3].push(result);
    }
    delete result["x"];
  }
  if (tabRes[0].length !== 0) {
    res.manga = sparqlToManga(crossArray(tabRes[0]));
  }
  if (tabRes[1].length !== 0) {
    res.anime = sparqlToAnime(crossArray(tabRes[1]));
  }
  if (tabRes[2].length !== 0) {
    res.author = sparqlToAuthor(crossArray(tabRes[2]));
  }
  if (tabRes[3].length !== 0) {
    res.character = sparqlToCharacter(crossArray(tabRes[3]));
  }
  return res;
}

/**
 * Transforms an object coming from a sparql request's response
 * into a manga.
 * It's fairly recommended to process the function crossArray
 * on the result BEFORE passing it to this function.
 *
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
      (<any> manga)[key] = (<any> sparqlResult[key][0]);
    } else if (key === "publicationDate") {
      (<any> manga)[key] = _.min(sparqlResult[key]);
    } else if (key === "author") {
      (<any> manga)[key] = sparqlResult[key][0];
    } else if (key === "snippet") {
      (<any> manga)[key] = sparqlResult[key][0];
    } else if (key === "volumes") {
      (<any> manga)[key] = _.max(sparqlResult[key].map((volume: string) => parseInt(volume, 10)));
    } else {
      (<any> manga)[key] = sparqlResult[key];
    }
  }
  return manga;
}

/**
 * Transforms an object coming from a sparql request's response
 * into a anime.
 *
 * @param sparqlResult The result coming from a response to a sparql request.
 */
export function sparqlToAnime(sparqlResult: RawResultArray): Anime {
  // TODO: collect data and build complete anime
  const anime: Anime = <any> {};
  for (const key in sparqlResult) {
    if (!sparqlResult.hasOwnProperty(key)) {
      continue;
    }
    if (sparqlResult[key].length === 1) {
      (<any> anime)[key] = (<any> sparqlResult[key][0]);
    } else if (key === "author") {
      (<any> anime)[key] = sparqlResult[key][0];
    } else if (key === "abstract") {
      (<any> anime)[key] = sparqlResult[key][0];
    }
  }
  return anime;
}

/**
 * Transforms an object coming from a sparql request's response
 * into an author.
 *
 * @param sparqlResult The result coming from a response to a sparql request.
 */
export function sparqlToAuthor(sparqlResult: RawResultArray): Author {
  // TODO: collect data and build complete author
  const author: Author = <any> {};
  for (const key in sparqlResult) {
    if (!sparqlResult.hasOwnProperty(key)) {
      continue;
    }
    if (sparqlResult[key].length === 1 && key === "title") {
      author["name"] = (<any> sparqlResult[key][0]);
    } else if (sparqlResult[key].length === 1) {
      (<any> author)[key] = (<any> sparqlResult[key][0]);
    } else if (key === "abstract") {
      author[key] = sparqlResult[key][0];
    } else if (key === "employer") {
      author[key] = sparqlResult[key][0];
    }
  }
  return author;
}

/**
 * Transforms an object coming from a sparql request's response
 * into a character.
 *
 * @param sparqlResult The result coming from a response to a sparql request.
 */
export function sparqlToCharacter(sparqlResult: RawResultArray): Character {
  // TODO: collect data and build complete character
  const character: Character = <any> {};
  for (const key in sparqlResult) {
    if (!sparqlResult.hasOwnProperty(key)) {
      continue;
    }
    if (sparqlResult[key].length === 1 && key === "title") {
      character["name"] = (<any> sparqlResult[key][0]);
    } else if (sparqlResult[key].length === 1 && key === "author") {
      character["creator"] = (<any> sparqlResult[key][0]);
    } else if (sparqlResult[key].length === 1) {
      (<any> character)[key] = (<any> sparqlResult[key][0]);
    } else if (key === "abstract") {
      character[key] = sparqlResult[key][0];
    } else if (key === "author") {
      // TODO: fix this
      (<any> character)["creator"] = sparqlResult[key][0];
    }
  }
  return character;
}

/**
 * Transform an array of same type objects in a object with arrays as fields,
 * deleting duplicated values in the process.
 *
 * @param sparqlResult The raw result sent by dbpedia.
 */
function crossArray(sparqlResult: any[]): RawResultArray {
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

/**
 * A sparql raw result array transformed into a single object.
 */
export interface RawResultArray {
  /**
   * "manga", "anime" and so on
   */
  x: string[];

  /**
   * Anime/Manga's title or people's name
   */
  title: string[];

  /**
   * Author of the manga/anime
   */
  author: string[];

  /**
   * Number of volumes or episodes
   */
  volumes: number[];

  /**
   * First volume/episode publication date or people's birthday
   */
  publicationDate: string[];

  /**
   * Illustrator of the manga/anime
   */
  illustrator: string[];

  /**
   * Publisher's name
   */
  publisher: string[];

  /**
   * Manga/Anime's abstract or snippet about people
   */
    abstract: string[];

  /**
   * To use syntax obj["key"]
   */
  [key: string]: any[];
}
