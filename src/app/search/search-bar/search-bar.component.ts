import {Component, OnInit} from "@angular/core";

@Component({
  selector: "mmg-search",
  moduleId: "search/search.component",
  templateUrl: "search.component.html",
  styleUrls: ["search.component.css"]
})
export class SearchComponent implements OnInit {
  ngOnInit(): void {
    console.log("Initialized search page");
  }
}
