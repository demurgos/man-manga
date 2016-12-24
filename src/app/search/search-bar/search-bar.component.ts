import {Component, OnInit}  from '@angular/core';

import {ApiService}         from '../services/api.service';
import {SearchResults}      from '../../../lib/interfaces/search-result.interface';

// TODO: does this component really performs any request ?

@Component({
  selector: "mmg-search",
  moduleId: "search/search-bar/search-bar.component",
  templateUrl: "search-bar.component.html",
  styleUrls: ["search-bar.component.css"]
})
export class SearchBarComponent implements OnInit {

  /**
   * Properly initialize component.
   */
  ngOnInit(): void {
    // Nothing to do for the moment
  }

  /**
   * An experimental search.
   */
  protected search(query: string): void {
    this.apiService
      .search(query)
      .then((results: SearchResults) => {
        console.log("RESULTS RECEIVED:");
        console.log(results);
      });
  }

  /**
   * Instantiates the component,
   * and initializes needed services.
   */
  constructor(private apiService: ApiService) {
    // Nothing else to do
  }
}
