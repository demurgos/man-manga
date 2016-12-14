import {Component, OnInit}  from '@angular/core';

import {ApiService}         from '../services/api.service';
import {Manga}              from '../../../lib/interfaces/manga.interface';

@Component({
  selector: "mmg-search",
  moduleId: "search/search-bar/search-bar.component",
  templateUrl: "search-bar.component.html",
  styleUrls: ["search-bar.component.css"],
  providers: [ApiService]
})
export class SearchBarComponent implements OnInit {
  private apiService: ApiService;

  /**
   * Properly initialize component.
   */
  ngOnInit(): void {
    console.log("Initialized search page");
    this.search();
  }

  protected search(): void {
    // TODO: gather input text
    let query: string = "Doraemon";
    this.apiService
      .getManga(query)
      .then((/*manga: Manga*/) => {
        // Do something with the manga
      });
  }

  /**
   * Instantiates the component,
   * and initializes needed services.
   */
  constructor(apiService: ApiService) {
    this.apiService = apiService;
    console.log(this.apiService);
  }
}
