import {ResourceBase} from "./resource-base";

export interface Author extends ResourceBase {
  type: "author";

  /**
   * The author's name.
   * Expected to be found for each author.
   */
  name: string;

  /**
   * A snippet about the author.
   */
  abstract?: string;

  /**
   * The author's birth date.
   */
  birthDate?: string; // TODO: datify

  /**
   * The author's employer
   * (usually a publisher).
   */
  employer?: string;

  /**
   * Other Sparql variables
   */
  others: {
    [variableName: string]: string[];
  };
}
