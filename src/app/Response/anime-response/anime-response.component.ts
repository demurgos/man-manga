import {Component, OnInit} from "@angular/core";

@Component({
  selector: "mmg-search",
  moduleId: "search/anime-response/anime-response.component",
  templateUrl: "anime-response.component.html",
  styleUrls: ["anime-response.component.css"]
})
export class AnimeComponent implements OnInit {
  ngOnInit(): void {
    console.log("Anime !");
  }
  name: string;
  episodes: number;
  author: string;
}
