import {Component, OnInit} from "@angular/core";
import {Manga} from "../../../lib/interfaces/resources/manga";

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

@Component({
  selector: "mmg-manga-response",
  moduleId: "response/manga-response/manga-response.component",
  templateUrl: "manga-response.component.html",
  styleUrls: ["manga-response.component.css"]
})
export class MangaComponent implements OnInit {
  protected manga: Manga;

  constructor() {
    // this.manga = manga;
  }

  ngOnInit(): void {
    console.log("Manga !");
    // this.manga = MANGATEST;
  }

  setManga(manga: Manga): void {
    this.manga = manga;
  }
}
