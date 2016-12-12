export interface Character {

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
}