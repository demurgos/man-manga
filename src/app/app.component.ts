import {Component, Inject, OnInit} from "@angular/core";
import {Manga} from "../lib/interfaces/manga.interface";
import {appEnvironment, Environment} from "./app.tokens";
import {SearchBarComponent} from "./search/search-bar/search-bar.component";

const MANGATEST: Manga = {
  title: "Death Note",
  author: {name: "Tsugumi Oba"},
  illustrator: ["Takeshi Obata"],
  volumes: 12,
  genres: ["Thriller", "Drama"],
  abstract: "Kira kill the world with a book from hell",
  coverUrl: "http://mcd.iosphe.re/n/41/1/front/a/"
};

@Component({
  selector: "mmg-app",
  moduleId: "app.component",
  templateUrl: "app.component.html",
  styleUrls: [
    "app.component.css"
  ]
})
export class AppComponent {
  private environment: Environment;
  manga: Manga;
  search: SearchBarComponent;

  constructor(@Inject(appEnvironment) environment: Environment) {
    this.environment = environment;
    console.log("Environment:");
    console.log(this.environment);
  }

  ngOnInit(): void {
    // this.manga = MANGATEST;
    // console.log(this.manga.title);
  }

}
