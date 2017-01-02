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

const MANGATEST: Manga = {
  title: "Death Note",
  author: {name: "Tsugumi Oba"},
  illustrator: ["Takeshi Obata"],
  volumes: 12,
  genres: ["Thriller", "Drama"],
  abstract: "Kira kill the world with a book from hell",
  coverUrl: "http://mcd.iosphe.re/n/41/1/front/a/"
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
  clickMessage: string;

  add(str: string): void {
    console.log(str);
    this.clickMessage = str;
  }
  /**
   * Properly initialize component.
   */
  ngOnInit(): void {
    // Nothing to do for the moment
    // document.addEventListener('click',this.searchQuery.bind(this))
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
    this.clickMessage = "e";
  }

  fillresponses(): void {
    for (const i of this.res) {
      console.log( i.anime + " " + i.manga + " " + i.author);
      if ( !isUndefined( i.anime ) ) {
        ( <AnimeComponent> this.tmpAnimeComponent ).setAnime( <Anime> i.anime );
        this.animesComp.push( <AnimeComponent> this.tmpAnimeComponent );
        this.animes.push( <Anime> i.anime );
      } else if ( !isUndefined( i.manga ) ) {
        (<MangaComponent> this.tmpMangaComponent).setManga(<Manga> i.manga);
        this.mangasComp.push(<MangaComponent> this.tmpMangaComponent);
        this.mangas.push(<Manga> i.manga);
      } else if ( !isUndefined( i.author ) ) {
        ( <AuthorComponent> this.tmpAuthorComponent ).setAuthor( <Author> i.author );
        this.authorsComp.push( <AuthorComponent> this.tmpAuthorComponent );
        this.authors.push( <Author> i.author );
      }
    }
    console.log( this.mangasComp );
    this.go = true;
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
