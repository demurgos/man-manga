import {Component, Input, OnInit} from "@angular/core";
import {Author} from "../../../lib/interfaces/author.interface";

const AUTHORTEST: Author = {
  name: "yolo"
};

@Component({
  selector: "mmg-author-response",
  moduleId: "response/author-response/author-response.component",
  templateUrl: "author-response.component.html",
  styleUrls: ["author-response.component.css"]
})
export class AuthorComponent implements OnInit {
  @Input() author: Author;

  ngOnInit(): void {
    console.log("Author !");
  }

  setAuthor(auth: Author): void {
    this.author = auth;
  }
}
