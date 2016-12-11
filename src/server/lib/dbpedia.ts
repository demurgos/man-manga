import * as Bluebird  from 'bluebird';
import * as request   from 'request-promise';

import {Manga}      from "../../lib/interfaces/manga.interface";
import {Anime}      from "../../lib/interfaces/anime.interface";
import {Character}  from "../../lib/interfaces/character.interface";
import {Author}     from "../../lib/interfaces/author.interface";

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
      return Bluebird.reject(new Error("This function is not implemented yet"));
    }

    export function getInfos(): Bluebird<any> {
      return Bluebird.reject(new Error("This function is not implemented yet"));
    }

    export function getAbstract(): Bluebird<string> {
      return Bluebird.reject(new Error("This function is not implemented yet"));
    }

    export function getAuthor(): Bluebird<Author> {
      return Bluebird.reject(new Error("This function is not implemented yet"));
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
    export function retrieve(name: string): Bluebird<Author> {
      return Bluebird.reject(new Error("This function is not implemented yet"));
    }
  }

}