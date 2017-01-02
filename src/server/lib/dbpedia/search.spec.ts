import {assert} from "chai";
import {SearchResult} from "../../../lib/interfaces/api/search";
import * as dbpediaSearch from "./search";

// dbpedia search result for "goku"
/* tslint:disable:max-line-length object-literal-key-quotes */
// tslint:disable-next-line:typedef
const data = {
  "head": {
    "link": [],
    "vars": [
      "title",
      "x",
      "author",
      "volumes",
      "publicationDate",
      "illustrator",
      "publisher",
      "abstract",
      "employer",
      "birthDate"
    ]
  },
  "results": {
    "distinct": false,
    "ordered": true,
    "bindings": [
      {
        "title": {
          "type": "uri",
          "value": "http://dbpedia.org/resource/Goku"
        },
        "x": {
          "type": "literal",
          "value": "character"
        },
        "author": {
          "type": "uri",
          "value": "http://dbpedia.org/resource/Akira_Toriyama"
        },
        "abstract": {
          "type": "literal",
          "xml:lang": "en",
          "value": "Son Goku (Japanese: 孫 悟空 Hepburn: Son Gokū) is a fictional character and the main protagonist of the Dragon Ball manga series created by Akira Toriyama. He is based on Sun Wukong, a main character in the classic Chinese novel Journey to the West. Goku is introduced in chapter #1 Bulma and Son Goku (ブルマと孫悟空 Buruma to Son Gokū), originally published in Japan's Weekly Shōnen Jump magazine on December 3, 1984, as an eccentric, monkey-tailed boy who practices martial arts and possesses superhuman strength. He meets Bulma and joins her on a journey to find the wish-granting Dragon Balls. Initially believed to be an Earthling, he is later revealed to be a member of an extraterrestrial warrior race called the Saiyans with the birth name Kakarrot (カカロット Kakarotto). As Goku matures, he becomes the universe's mightiest warrior and protects his adopted home planet, Earth, from villains who wish to harm it. Goku is depicted as carefree and cheerful when at ease, but quickly serious and strategic-minded when fighting. He is able to concentrate his ki and use it for devastatingly powerful energy-based attacks, the most prominent being his signature Kamehameha (かめはめ波, lit. \"Turtle Destruction Wave\") wave, in which Goku launches a blue energy blast from his palms. Also pure of heart, Goku cannot be harmed by evil waves like the Devil Beam, and he is one of the few who can ride the magic cloud called Kinto'un (筋斗雲, lit. \"Somersault Cloud\", renamed \"Nimbus\" in Funimation's dub). As the protagonist, Goku appears in most of the episodes, films, television specials and OVAs of the manga's anime adaptations (Dragon Ball, Dragon Ball Z, Dragon Ball GT and Dragon Ball Super), as well as many of the franchise's video games. Due to the series' international popularity, Goku has become one of the most recognizable and iconic anime characters in the world. Outside the Dragon Ball franchise, Goku has made cameo appearances in Toriyama's self-parody series Neko Majin Z, has been the subject of other parodies, and has appeared in special events. Most Western audiences were introduced to the adult version of Goku appearing in the Dragon Ball Z anime, itself an adaptation of Dragon Ball manga volumes 17-42, as opposed to his initial child form, due to the limited success of the first series overseas. Goku's critical reception has been largely positive and he has been recognized as one of the greatest manga and anime characters of all time."
        }
      }
    ]
  }
};
/* tslint:enable */

// TODO: tests...

describe.skip("dbpedia.search", function () {
  // TODO: Use the saved files to tests the formatter
});
