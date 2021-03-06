import {Component, Input, OnInit} from "@angular/core";
import {Anime} from "../../../lib/interfaces/resources/anime";

const ANIMETEST: Anime = {
  type: "anime",
  title: "One piece",
  others: {}
};

@Component({
  selector: "mmg-anime-response",
  moduleId: "response/anime-response/anime-response.component",
  templateUrl: "anime-response.component.html",
  styleUrls: ["anime-response.component.css"]
})
export class AnimeComponent implements OnInit {
  @Input() anime: Anime;

  ngOnInit(): void {
    console.log("Anime !");
  }

  setAnime(anime: Anime): void {
    this.anime = anime;
  }
}
