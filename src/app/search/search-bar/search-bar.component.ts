import {Component, OnInit} from "@angular/core";
import {isUndefined} from "util";
import {Anime} from "../../../lib/interfaces/anime.interface";
import {Author} from "../../../lib/interfaces/author.interface";
import {Manga} from "../../../lib/interfaces/manga.interface";
import {SearchResults} from "../../../lib/interfaces/search-result.interface";
import {AnimeComponent} from "../../response/anime-response/anime-response.component";
import {AuthorComponent} from "../../response/author-response/author-response.component";
import {MangaComponent} from "../../response/manga-response/manga-response.component";
import {ApiService} from "../services/api.service";

const MANGATEST1: Manga = {
  title: "Death Note",
  author: {name: "Tsugumi Oba"},
  illustrator: ["Takeshi Obata"],
  volumes: 12,
  genres: ["Thriller", "Drama"],
  abstract: "Kira kill the world with a book from hell",
  coverUrl: "http://mcd.iosphe.re/n/41/1/front/a/"
};

const MANGATEST2: Manga = {
  title: "Something else",
  author: {name: "Takeshi Obutu Oba"},
  illustrator: ["Blabla Obata"],
  volumes: 145,
  genres: ["Thriller", "Drama", "Action"],
  abstract: "Kira  hell",
  coverUrl: ""
};

const ANIMETEST1: Anime = {
  title: "One piece"
};

const ANIMETEST2: Anime = {
  title: "Naruto",
  author: {name: "Kishimoto"},
  abstract: "Naruto wants to become the greatest ninja of all time",
  episodes: 165,
  posterUrl: "http://2.bp.blogspot.com/-jHfXDVdyEMk/UHUUAF1S95I/AAAAAAAAAac/YN0j_iNcmYk/s1600/Naruto+Cover.jpg"
};

// TODO: does this component really perform any request ?
@Component({
  selector: "mmg-search",
  moduleId: "search/search-bar/search-bar.component",
  templateUrl: "search-bar.component.html",
  styleUrls: ["search-bar.component.css"]
})

export class SearchBarComponent implements OnInit {
  private apiService: ApiService;
  res: SearchResults;
  mangas: Manga[];
  animes: Anime[];
  authors: Author[];
  clickMessage: string;
  mangaFilterOn: boolean;
  animeFilterOn: boolean;
  authorFilterOn: boolean;

  chgManga(mgfltr: boolean): void {
    this.mangaFilterOn = mgfltr;
  }
  chgAnime(anmfltr: boolean): void {
    this.animeFilterOn = anmfltr;
  }
  chgAuthor(athfltr: boolean): void {
    this.authorFilterOn = athfltr;
  }

  add(str: string): void {
    console.log(str);
    this.clickMessage = str;
    // this.search(str);
    // this.mangas = [];
    // this.animes = [];
    // this.authors = [];
  }
  /**
   * Properly initialize component.
   */
  ngOnInit(): void {

    // Nothing to do for the moment
    this.mangas = [MANGATEST1, MANGATEST2];
    this.animes = [ANIMETEST1, ANIMETEST2];
    this.authors = [];
    this.clickMessage = "e";
    this.mangaFilterOn = true;
    this.animeFilterOn = true;
    this.authorFilterOn = true;
    // this.search("One Piece");
  }

  fillresponses(): void {
    for (const i of this.res) {
      if ( !isUndefined( i.anime ) ) {
        this.animes.push( <Anime> i.anime );
      } else if ( !isUndefined( i.manga ) ) {
        this.mangas.push(<Manga> i.manga);
      } else if ( !isUndefined( i.author ) ) {
        this.authors.push( <Author> i.author );
      }
    }
  }
  /**
   * An experimental search.
   */
  protected search(query: string): void {
    this.apiService
      .search(query)
      .then((results: SearchResults) => {
        console.log("RESULTS RECEIVED:");
        // console.log(results);
        this.res = results;
        this.fillresponses();
      });
  }

  /**
   * Instantiates the component,
   * and initializes needed services.
   */
  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }
}
