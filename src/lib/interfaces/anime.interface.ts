import {Manga} from './manga.interface'

export interface Anime {

  /**
   * The title of the anime.
   * Expected to be found for each anime.
   */
  title: string;

  /**
   * The associated manga,
   * if the anime is based on a manga.
   */
  manga?: Manga;
}