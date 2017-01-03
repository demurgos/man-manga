import {ResourceBase} from "./resource-base";

export interface MangaCover extends ResourceBase {
  type: "manga-cover";

  /**
   * The manga's title.
   */
  title: string;

  /**
   * The first volume's front cover URL.
   */
  coverUrl: string;

  /**
   * All known covers.
   * NOTE: for the moment, not used by the API.
   */
  covers?: string[];
}
