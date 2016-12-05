import {Component, OnInit} from "@angular/core";

@Component({
  selector: "mmg-search",
  moduleId: "search/search-bar/search-bar.component",
  templateUrl: "search-bar.component.html",
  styleUrls: ["search-bar.component.css"]
})
export class SearchBarComponent implements OnInit {
  ngOnInit(): void {
    console.log("Initialized search page");
  }
}
