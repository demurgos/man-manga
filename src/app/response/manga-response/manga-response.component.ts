import {Component, Input, OnInit} from "@angular/core";
import {Manga} from "../../../lib/interfaces/manga.interface";

const EMPTYMANGA: Manga = {
  title: "No manga !"
};

@Component({
  selector: "mmg-manga-response",
  moduleId: "response/manga-response/manga-response.component",
  templateUrl: "manga-response.component.html",
  styleUrls: ["manga-response.component.css"]
})
export class MangaComponent implements OnInit {
  @Input() manga: Manga;

  constructor() {
  }

  ngOnInit(): void {
    console.log("Manga !");
    // this.manga = EMPTYMANGA;
  }

  setManga(manga: Manga): void {
    this.manga = manga;
  }
}
