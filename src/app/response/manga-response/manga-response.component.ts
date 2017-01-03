import {Component, Input} from "@angular/core";
import {Manga} from "../../../lib/interfaces/resources/manga";

@Component({
  selector: "mmg-manga-response",
  moduleId: "response/manga-response/manga-response.component",
  templateUrl: "manga-response.component.html",
  styleUrls: ["manga-response.component.css"]
})
export class MangaComponent {
  @Input() manga: Manga;

  setManga(manga: Manga): void {
    this.manga = manga;
  }
}
