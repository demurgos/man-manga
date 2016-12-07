import {Author} from './author.interface.ts';
import {Character} from './character.interface.ts';

export interface Manga {

  /**
   * The title of the manga.
   * Expected to be found for each manga.
   */
  title: string;

  /**
   * The main author's name.
   * Expected to be found for each manga.
   */
  author: Author;

  /**
   * The illustrator's name.
   */
  illustrator?: string

  /**
   * The list of all known characters.
   */
  characters?: Character[];

  /**
   * A snippet from this manga.
   */
  snippet?: string;

  /**
   * An URL to one cover.
   */
  coverUrl?: string;

  /**
   * The list of all known themes in this manga.
   */
  theme?: string[];

  /**
   * The number of edited volumes.
   */
  volumes?: number;

  /**
   * The first publicatin date.
   */
  publicationDate: string; // TODO: datify
}