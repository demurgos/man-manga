import {Character} from "../../lib/interfaces/character.interface";
import * as io from "../../lib/interfaces/io";
import requestIO from "./request-io";

export class AnilistApi {
  /**
   * Anilist's API entry point.
   *
   * @type {string}
   */
  public static readonly anilistEntryPoint: string = "https://anilist.co/api";

  /**
   * The app client's ID.
   * Must stay secret.
   *
   * @type {string}
   */
  private static readonly clientID: string = "sn0wfox-syfsx";

  /**
   * The app client's secret.
   * Must stay secret.
   * @type {string}
   */
  private static readonly clientSecret: string = "i9fiEWiHzOKxhp0FDy9I3pwY5RX2n";

  /**
   * The app authentication token.
   * Without this, no anilist's API calls can be performed.
   * Undefined until the first API call.
   */
  protected authToken: {
    token: string,
    expirationDate: number  // Timestamp in seconds
  };

  /**
   * Updates the field authToken with a new token,
   * or returns a promise rejection if there was an error with the request.
   */
  protected async getAuthToken(): Promise<void> {
    try {
      const response: io.Response = await requestIO.post({
        // TODO: use path.posix.join
        uri: `${AnilistApi.anilistEntryPoint}/auth/access_token`,
        form: {
          grant_type: "client_credentials",
          client_id: AnilistApi.clientID,
          client_secret: AnilistApi.clientSecret
        }
      });

      const token: any = JSON.parse(response.body);

      this.authToken = {
        token: token.access_token,
        expirationDate: token.expires
      };
    } catch (err) {
      throw new Error(`Can't gather new Anilist auth token\n${err}`);
    }
  }

  /**
   * Gathers all known information about the given character,
   * or a promise rejection if there was an error with the request.
   * If no information can be found about the given character,
   * returns a promise rejection.
   * Meant to research a character with a precise name;
   * to search a character with a fragment name,
   * please take a look at searchCharacter().
   *
   * @param name The character's name.
   */
  public async getCharacter(name: string): Promise<Character> {
    await this.ensureAuth();
    const response: io.Response = await requestIO.get({
      // TODO: use path.posix.join
      uri: `${AnilistApi.anilistEntryPoint}/character/search/${name}`,
      queryString: {
        access_token: this.authToken.token
      }
    });

    const result: {id: number}[] = JSON.parse(response.body);

    if (!result[0]) {
      throw new Error(`Unable to find character ${name}`);
    }

    return this.getCharacterById(result[0].id);
  }

  /**
   * Gathers all known information about the given character,
   * or a promise rejection if there was an error with the request.
   * If no information can be found about the given character,
   * returns a promise rejection.
   */
  protected async getCharacterById(id: number | string): Promise<Character> {
    await this.ensureAuth();

    const response: io.Response = await requestIO.get({
      // TODO: use path.posix.join
      uri: `${AnilistApi.anilistEntryPoint}/character/${id}/page`,
      queryString: {
        access_token: this.authToken.token
      }
    });

    const character: any = JSON.parse(response.body);
    if (!character) {
      throw new Error(`Unable to find character with id ${id}`);
    }

    let from: string;
    if (character.manga.length !== 0) {
      from = character.manga[0].title_romaji;
    } else {
      from = character.anime[0].title_romaji;
    }

    return {
      name: `${character.name_first} ${character.name_last}`,
      pictureUrl: character.image_url_lge,
      from: from
    };
  }

  /**
   * Ensure that the authentication token won't expire soon,
   * so requests can be safely made to the API.
   */
  protected async ensureAuth(): Promise<void> {
    // If the token has still more than one minutes before expiration,
    // we don't need to regenerate one
    if (this.authToken && Date.now() < this.authToken.expirationDate - 60) {

      return;
    }

    // Otherwise, we should (re)generate one
    return this.getAuthToken();
  }
}
