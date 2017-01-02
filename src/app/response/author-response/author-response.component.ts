import {Component, OnInit} from "@angular/core";
import {Author} from "../../../lib/interfaces/resources/author";

@Component({
  selector: "mmg-author-response",
  moduleId: "response/author-response/author-response.component",
  templateUrl: "author-response.component.html",
  styleUrls: ["author-response.component.css"]
})
export class AuthorComponent implements OnInit {
  author: Author;
  name: string;
  lastname: string;
  works: string[];

  ngOnInit(): void {
    console.log("Author !");
  }

  setAuthor(auth: Author): void {
    this.author = auth;
  }
}
