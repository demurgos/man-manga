import {Component, Inject, OnInit} from "@angular/core";
import {Manga} from "../lib/interfaces/manga.interface";
import {appEnvironment, Environment} from "./app.tokens";
import {SearchBarComponent} from "./search/search-bar/search-bar.component";

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
  search: SearchBarComponent;

  constructor(@Inject(appEnvironment) environment: Environment) {
    this.environment = environment;
  }
}
