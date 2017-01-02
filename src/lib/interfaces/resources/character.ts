import {Author} from "./author";
import {ResourceBase} from "./resource-base";

export interface Character extends ResourceBase {
  type: "character";

  /**
   * The character's name.
   * Expected to be found for each character.
   */
  name: string;

  /**
   * An URL to a picture of the character.
   */
  pictureUrl?: string;

  /**
   * The name of the manga/anime from which the character is coming.
   */
  from?: string;

  /**
   * The character's creator.
   */
  creator?: Author;

  /**
   * A snippet about the character.
   */
  abstract?: string;

  /**
   * Other Sparql variables
   */
  others: {
    [variableName: string]: string[];
  };
}
