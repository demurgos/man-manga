import {Component, OnInit} from "@angular/core";

@Component({
  selector: "mmg-manga-response",
  moduleId: "response/manga-response/manga-response.component",
  templateUrl: "manga-response.component.html",
  styleUrls: ["manga-response.component.css"]
})
export class MangaComponent implements OnInit {
  ngOnInit(): void {
    console.log("Manga !");
  }
  name: string;
  author: string;
  illustrator: string;
  volumes: number;
}
