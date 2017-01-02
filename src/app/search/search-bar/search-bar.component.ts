import {Component, OnInit} from "@angular/core";
import {SearchResults} from "../../../lib/interfaces/search-result.interface";
import {SearchResult} from "../../../lib/interfaces/search-result.interface";
import {ApiService} from "../services/api.service";
import {MangaComponent} from "../../response/manga-response/manga-response.component"
import {AnimeComponent} from "../../response/anime-response/anime-response.component"
import {AuthorComponent} from "../../response/author-response/author-response.component"
import {Manga} from "../../../lib/interfaces/manga.interface"
import {Anime} from "../../../lib/interfaces/anime.interface"
import {Author} from "../../../lib/interfaces/author.interface"
import {isUndefined} from "util";

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
  /**
   * Properly initialize component.
   */
  ngOnInit(): void {
    // Nothing to do for the moment
    this.go=false;
    this.tmpMangaComponent=new MangaComponent();
    this.tmpMangaComponent.setManga(MANGATEST);
    this.tmpAnimeComponent=new AnimeComponent();
    this.tmpAuthorComponent=new AuthorComponent();
    this.mangasComp=[this.tmpMangaComponent];
    this.mangas=[];
    this.animesComp=[];
    this.animes=[];
    this.authorsComp=[];
    this.authors=[];

    this.search('One Piece');
  }

  fillresponses(): void {
    for(var i = 1; i < this.res.length;i++){
      console.log(this.res[i].anime + " "+this.res[i].manga+" "+this.res[i].author);
      if(!isUndefined(this.res[i].anime)){
        (<AnimeComponent> this.tmpAnimeComponent).setAnime(<Anime>this.res[i].anime);
        this.animesComp.push(<AnimeComponent> this.tmpAnimeComponent);
        this.animes.push(<Anime>this.res[i].anime);
      }
      else if(!isUndefined(this.res[i].manga)){
        (<MangaComponent> this.tmpMangaComponent).setManga(<Manga>this.res[i].manga);
        this.mangasComp.push(<MangaComponent> this.tmpMangaComponent);
        this.mangas.push(<Manga>this.res[i].manga);
      }
      else if(!isUndefined(this.res[i].author)){
        (<AuthorComponent> this.tmpAuthorComponent).setAuthor(<Author>this.res[i].author);
        this.authorsComp.push(<AuthorComponent> this.tmpAuthorComponent);
        this.authors.push(<Author>this.res[i].author);
      }
    }
    console.log(this.mangasComp);
    this.go=true;
  }
  /**
   * An experimental search.
   */
  protected search(query: string): void {
    this.apiService
      .search(query)
      .then((results: SearchResults) => {
        console.log("RESULTS RECEIVED:");
        //console.log(results);
        this.res=results;
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
