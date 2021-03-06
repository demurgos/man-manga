import {Component, OnInit} from "@angular/core";
import {isUndefined} from "util";
import {SearchResult} from "../../../lib/interfaces/api/search";
import {Anime, Author, Manga} from "../../../lib/interfaces/resources/index";
import {AnimeComponent} from "../../response/anime-response/anime-response.component";
import {AuthorComponent} from "../../response/author-response/author-response.component";
import {MangaComponent} from "../../response/manga-response/manga-response.component";
import {ApiService} from "../services/api.service";

const MANGATEST1: Manga = {
  type: "manga",
  title: "Death Note",
  author: {
    type: "author",
    name: "Tsugumi Oba",
    others: {}
  },
  illustrator: ["Takeshi Obata"],
  volumes: 12,
  genres: ["Thriller", "Drama"],
  // tslint:disable-next-line:max-line-length
  abstract: "Kira kill the world with a book from hell   aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  coverUrl: "http://mcd.iosphe.re/n/41/1/front/a/",
  others: {}
};

const MANGATEST2: Manga = {
  type: "manga",
  title: "Something else",
  author: {
    type: "author",
    name: "Takeshi Obutu Oba",
    others: {}
  },
  illustrator: ["Blabla Obata"],
  volumes: 145,
  genres: ["Thriller", "Drama", "Action"],
  abstract: "Kira  hell",
  coverUrl: "",
  others: {}
};

const ANIMETEST1: Anime = {
  type: "anime",
  title: "One piece",
  others: {}
};

const ANIMETEST2: Anime = {
  type: "anime",
  title: "Naruto",
  author: {
    type: "author",
    name: "Kishimoto",
    others: {}
  },
  abstract: "Naruto wants to become the greatest ninja of all time",
  episodes: 165,
  posterUrl: "http://2.bp.blogspot.com/-jHfXDVdyEMk/UHUUAF1S95I/AAAAAAAAAac/YN0j_iNcmYk/s1600/Naruto+Cover.jpg",
  others: {}
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
  res: SearchResult[];
  mangas: Manga[] = [MANGATEST1, MANGATEST2];
  animes: Anime[] = [];
  authors: Author[] = [];
  clickMessage: string;
  mangaFilterOn: boolean;
  animeFilterOn: boolean;
  authorFilterOn: boolean;

  /**
   * Instantiates the component,
   * and initializes needed services.
   */
  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

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
    delete this.mangas;
    this.mangas = [];
    delete this.animes;
    this.animes = [];
    delete this.authors;
    this.authors = [];
    console.log(this.mangas);
    this.search(str);
  }
  /**
   * Properly initialize component.
   */
  ngOnInit(): void {
    // Nothing to do for the moment
    this.mangas = [];
    this.animes = [];
    this.authors = [];
    this.clickMessage = "e";
    this.mangaFilterOn = true;
    this.animeFilterOn = true;
    this.authorFilterOn = true;
    // this.search("One Piece");
  }

  fillresponses(): void {
    this.mangas = [];
    this.animes = [];
    this.authors = [];
    for (const result of this.res) {
      switch (result.type) {
        case "anime":
          this.animes.push(<Anime> result);
          break;
        case "manga":
          this.mangas.push(<Manga> result);
          break;
        case "author":
          this.authors.push(result);
          break;
        default:
          console.warn(`Unsupported resource type: ${result.type}`);
      }
    }
  }

  /**
   * An experimental search.
   */
  protected async search(query: string): Promise<void> {
    const results: SearchResult[] = await this.apiService.search(query);
    console.log("RESULTS RECEIVED:");
    console.log(results);
    this.res = results;
    this.fillresponses();
  }
}
