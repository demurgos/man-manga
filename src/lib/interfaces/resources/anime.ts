import {Author} from "./author";
import {Manga} from "./manga";
import {ResourceBase} from "./resource-base";

export interface Anime extends ResourceBase {
  type: "anime";

  /**
   * The title of the anime.
   * Expected to be found for each anime.
   */
  title: string;

  /**
   * The associated manga,
   * if the anime is based on a manga.
   */
  // TODO: not used at the moment
  manga?: Manga;

  /**
   * The anime's author.
   */
  author?: Author;

  /**
   * An abstract of this anime.
   */
  abstract?: string;

  /**
   * The number of episodes.
   */
  episodes?: number;

  /**
   * An URL to the poster.
   */
  posterUrl?: string;

  /**
   * The list of all known genres for this anime.
   */
  genres?: string[];

  /**
   * Other Sparql variables
   */
  others: {
    [variableName: string]: string[];
  };
}
