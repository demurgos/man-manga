import {Component, OnInit} from "@angular/core";
import {Manga} from "../../../lib/interfaces/manga.interface"

const MANGATEST: Manga = {
  title: 'Death Note',
  author: {name :'Tsugumi Oba'},
  illustrator : ['Takeshi Obata'],
  volumes : 12,
  theme: ['Thriller'],
  snippet: 'Kira kill the world with a book from hell'
};

@Component({
  selector: "mmg-manga-response",
  moduleId: "response/manga-response/manga-response.component",
  templateUrl: "manga-response.component.html",
  styleUrls: ["manga-response.component.css"]
})
export class MangaComponent implements OnInit {
  protected manga : Manga;

  constructor() {
    // this.manga = MANGATEST; // 1/2 won't work
  }

  ngOnInit(): void {
    console.log("Manga !");
    this.manga = MANGATEST;
  }

}
