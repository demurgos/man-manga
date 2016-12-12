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
    expirationDate: number
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
      let time = Date.now();
      this.authToken = {
        token: body["access_token"],
        expirationDate: body["expires"]
      };
      console.log(time);
      console.log(time / 1000);
      console.log(body["expires"]);
      return;
    })
    .catch((err: any) => {
      return Bluebird.reject(new Error("Can't gather new Anilist auth token\n" + err));
    });
  }

  /**
   * Gathers all known information about the given character,
   * or a promise rejection if tehre was an error with the request.
   * If no information can be found about the given character,
   * returns
   * @param name
   */
  public getCharacter(name: string): Bluebird<Character> {
    return Bluebird.try(() => {
      if(Date.now() < this.authToken.expirationDate - 1000) {
        return;
      }
      return this.getAuthToken();
    })
    .then(() => {
      return request({
        url: AnilistApi.anilistEntryPoint
          + "/character/search"
          + name
          + "?access_token="
          + this.authToken.token,
        json: true
      })
    })
    .then((something: any) => {
      console.log(something);
      return {
        name: something["name_first"] + " " + something["name_last"]
      };
    })
    .catch((err: any) => {
      return Bluebird.reject(err);
    });
  }
}