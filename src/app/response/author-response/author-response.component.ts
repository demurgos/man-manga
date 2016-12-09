import {Component, OnInit} from "@angular/core";

@Component({
  selector: "mmg-author-response",
  moduleId: "response/author-response/author-response.component",
  templateUrl: "author-response.component.html",
  styleUrls: ["author-response.component.css"]
})
export class AuthorComponent implements OnInit {
  ngOnInit(): void {
    console.log("Author !");
  }
  name: string;
  lastname: string;
  works:string[];
}
