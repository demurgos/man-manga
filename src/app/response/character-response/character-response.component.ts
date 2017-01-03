import {Component, Input} from "@angular/core";
import {Character} from "../../../lib/interfaces/resources/index";

const testCharacter: Character = {
  type: "character",
  name: "Naruto",
  pictureUrl: "https://dw9to29mmj727.cloudfront.net/misc/newsletter-naruto3.png",
  abstract: "A ninja",
  from: "Naruto",
  creator: {
    type: "author",
    name: "Someone",
    others: {}
  },
  others: {}
};

@Component({
  selector: "mmg-character-response",
  moduleId: "response/character-response/character-response.component",
  templateUrl: "character-response.component.html",
  styleUrls: ["character-response.component.css"]
})
export class CharacterComponent {
  @Input() character: Character;

  setAnime(anime: Character): void {
    this.character = anime;
  }
}
