import * as Bluebird  from 'bluebird';
import * as request   from 'request-promise';
import {Character} from "../../lib/interfaces/character.interface";

export class AnilistApi {

  /**
   * Anilist's API entry point.
   * @type {string}
   */
  public static readonly anilistEntryPoint: string = "https://anilist.co/api";

  /**
   * The app client's ID.
   * Must stay secret.
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
   * The aapp authentication token.
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
  protected getAuthToken(): Bluebird<void> {
    return request({
      method: 'POST',
      url: AnilistApi.anilistEntryPoint + "/auth/access_token",
      form: {
        grant_type: "client_credentials",
        client_id: AnilistApi.clientID,
        client_secret: AnilistApi.clientSecret
      }
    })
    .then((body: any) => {
      let token = JSON.parse(body);
      this.authToken = {
        token: token["access_token"],
        expirationDate: token["expires"]
      };
      return;
    })
    .catch((err: any) => {
      return Bluebird.reject(new Error("Can't gather new Anilist auth token\n" + err));
    });
  }

  /**
   * Gathers all known information about the given character,
   * or a promise rejection if there was an error with the request.
   * If no information can be found about the given character,
   * returns
   * @param name The character's name.
   */
  public getCharacter(name: string): Bluebird<Character> {
    return Bluebird.try(() => {
      if(this.authToken && Date.now() < this.authToken.expirationDate - 60) {
        // If the token has still more than one minutes before expiration,
        // we don't need to regenerate one
        return;
      }
      // Otherwise, we should (re)generate one
      return this.getAuthToken();
    })
    .then(() => {
      console.log("Looking for character " + name + "...");
      return request({
        url: AnilistApi.anilistEntryPoint
          + "/character/search/"
          + name
          + "?access_token="
          + this.authToken.token,
        json: true
      })
    })
    .then((something: any) => {
      return {
        name: something[0]["name_first"] + " " + something[0]["name_last"]
      };
    })
    .catch((err: any) => {
      return Bluebird.reject(err);
    });
  }
}