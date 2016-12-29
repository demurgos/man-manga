import {Author} from "./author.interface";
import {Character} from "./character.interface";

export interface Manga {
  /**
   * The title of the manga.
   * Expected to be found for each manga.
   */
  title: string;

  /**
   * A short description of the manga
   */
  snippet?: string;

  /**
   * The main author's name.
   * Expected to be found for each manga.
   */
  author: Author;

  /**
   * The list of all known illustrators' names.
   */
  illustrator?: string[];

  /**
   * The list of all known characters.
   */
  // TODO: not used for the moment
  characters?: Character[];

  /**
   * An abstract of this manga.
   */
  abstract?: string;

  /**
   * An URL to one cover.
   */
  coverUrl?: string;

  /**
   * The list of all known genres for this manga.
   */
  genres?: string[];

  /**
   * The number of edited volumes.
   */
  volumes?: number;

  /**
   * The first publication date.
   */
  publicationDate?: string; // TODO: use Date object

  /**
   * The manga's list of known publishers.
   */
  publishers?: string[];
}
