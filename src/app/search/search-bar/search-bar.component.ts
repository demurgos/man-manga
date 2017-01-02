import {Component, OnInit} from "@angular/core";
import {isUndefined} from "util";
import {SearchResult} from "../../../lib/interfaces/api/search";
import {Anime, Author, Manga} from "../../../lib/interfaces/resources/index";
import {AnimeComponent} from "../../response/anime-response/anime-response.component";
import {AuthorComponent} from "../../response/author-response/author-response.component";
import {MangaComponent} from "../../response/manga-response/manga-response.component";
import {ApiService} from "../services/api.service";

const MANGATEST: Manga = {
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
  abstract: "Kira kill the world with a book from hell",
  coverUrl: "http://mcd.iosphe.re/n/41/1/front/a/",
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
  tmpMangaComponent: MangaComponent;
  mangas: Manga[];
  mangasComp: MangaComponent[];
  tmpAnimeComponent: AnimeComponent;
  animes: Anime[];
  animesComp: AnimeComponent[];
  tmpAuthorComponent: AuthorComponent;
  authors: Author[];
  authorsComp: AuthorComponent[];
  go: boolean;

  /**
   * Properly initialize component.
   */
  ngOnInit(): void {
    // Nothing to do for the moment
    this.go = false;
    this.tmpMangaComponent = new MangaComponent();
    this.tmpMangaComponent.setManga(MANGATEST);
    this.tmpAnimeComponent = new AnimeComponent();
    this.tmpAuthorComponent = new AuthorComponent();
    this.mangasComp = [this.tmpMangaComponent];
    this.mangas = [];
    this.animesComp = [];
    this.animes = [];
    this.authorsComp = [];
    this.authors = [];
    this.search("One Piece");
  }

  fillresponses(): void {
    for (const result of this.res) {
      switch (result.type) {
        case "anime":
          this.tmpAnimeComponent.setAnime(result);
          this.animesComp.push(this.tmpAnimeComponent);
          this.animes.push(result);
          break;
        case "manga":
          this.tmpMangaComponent.setManga(result);
          this.mangasComp.push(this.tmpMangaComponent);
          this.mangas.push(result);
          break;
        case "author":
          this.tmpAuthorComponent.setAuthor(result);
          this.authorsComp.push(this.tmpAuthorComponent);
          this.authors.push(result);
          break;
        default:
          console.warn(`Unsupported resource type: ${result.type}`);
      }
    }
    this.go = true;
  }

  /**
   * An experimental search.
   */
  protected search(query: string): void {
    this.apiService
      .search(query)
      .then((results: SearchResult[]) => {
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
