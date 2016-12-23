import {Manga}      from './manga.interface';
import {Anime}      from './anime.interface';
import {Author}     from './author.interface';
import {Character}  from './character.interface';

export interface SearchResult {
  
  /**
   * The list of possible mangas matching the search criteria.
   */
  manga: Manga[];

  /**
   * The list of possible animes matching the search criteria.
   */
  anime: Anime[];

  /**
   * The list of possible authors matching the search criteria.
   */
  author: Author[];

  /**
   * The list of possible characters matching the search criteria.
   */
  character: Character[];
}