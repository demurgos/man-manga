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
   * The app authentication token.
   * Without this, no anilist's API calls can be performed.
   * Undefined until the first API call.
   */
  protected authToken: {
    token: string,
    expirationDate: number  // Timestamp in seconds
  };

  /**
   * Gathers all known information about the given character,
   * or a promise rejection if there was an error with the request.
   * If no information can be found about the given character,
   * returns a promise rejection.
   * Meant to research a character with a precise name;
   * to search a character with a fragment name,
   * please take a look at searchCharacter().
   * @param name The character's name.
   */
  public getCharacter(name: string): Bluebird<Character> {
    return this
      .ensureAuth()
      .then(() => {
        return request({
          url: AnilistApi.anilistEntryPoint
            + "/character/search/"
            + name
            + "?access_token="
            + this.authToken.token,
          json: true
        });
      })
      .then((result: any) => {
        if(!result[0]) {
          return Bluebird.reject(new Error("Unable to find character " + name));
        }
        return this.getCharacterByID(result[0]["id"]);
      })
      .catch((err: any) => {
        return Bluebird.reject(err);
      });
  }

  /**
   * Gathers all known information about the given character,
   * or a promise rejection if there was an error with the request.
   * If no information can be found about the given character,
   * returns a promise rejection.
   */
  protected getCharacterByID(id: number | string): Bluebird<Character> {
    return this
      .ensureAuth()
      .then(() => {
        return request({
          url: AnilistApi.anilistEntryPoint
            + "/character/"
            + id
            + "/page"
            + "?access_token="
            + this.authToken.token,
          json: true
        });
      })
      .then((character: any) => {
        if(!character) {
          return Bluebird.reject(new Error("Unable to find character with id " + id))
        }
        let from: string;
        if(character["manga"].length !== 0) {
          from = character["manga"][0]["title_romaji"];
        } else {
          from = character["anime"][0]["title_romaji"];
        }
        return {
          name: character["name_first"] + " " + character["name_last"],
          pictureUrl: character["image_url_lge"],
          from: from
        };
      })
      .catch((err: any) => {
        return Bluebird.reject(err);
      });
  }

  /**
   * Searches all mangas matching the given keywords.
   * @param keywords A string containing all keywords to search,
   * separated by spaces.
   */
  public searchManga(keywords: string): Bluebird<any> {
    return this.search("manga", keywords);
  }

  /**
   * Searches all animes matching the given keywords.
   * @param keywords A string containing all keywords to search,
   * separated by spaces.
   */
  public searchAnime(keywords: string): Bluebird<any> {
    return this.search("anime", keywords);
  }

  /**
   * Searches all characters matching the given keywords.
   * @param keywords A string containing all keywords to search,
   * separated by spaces.
   */
  public searchCharacter(keywords: string): Bluebird<any> {
    return this.search("character", keywords);
  }

  /**
   * Searches all staff (actor, writer, ...) matching the given keywords.
   * @param keywords A string containing all keywords to search,
   * separated by spaces.
   */
  public searchStaff(keywords: string): Bluebird<any> {
    return this.search("staff", keywords);
  }

  /**
   * Searches all studios matching the given keywords.
   * @param keywords A string containing all keywords to search,
   * separated by spaces.
   */
  public searchStudio(keywords: string): Bluebird<any> {
    return this.search("studio", keywords);
  }

  /**
   * Searches the given keywords thanks to the anilist API.
   * Results' types will vary with the parameter toSearch.
   * @param toSearch The object to search. Must be in ["anime", "character", "manga", "staff", "studio"].
   * @param keywords The keywords that must be searched.
   */
  protected search(toSearch: string, keywords: string): Bluebird<any> {
    toSearch = toSearch.toLowerCase();
    const allowedToSearch = ["anime", "character", "manga", "staff", "studio"];
    if(!(toSearch in allowedToSearch)) {
      return Bluebird.reject(new Error(
        toSearch + " is not a known searchable object. Must be one of " + allowedToSearch + "."
      ));
    }
    return this
      .ensureAuth()
      .then(() => {
        return request({
          url: encodeURI(AnilistApi.anilistEntryPoint
          + toSearch
          + "/search/"
          + keywords),
          json: true
        });
      })
      .then((res: any) => {
        console.log(res);
        return res;
      })
      .catch((err: any) => {
        return Bluebird.reject(err);
      });
  }

  /**
   * Ensure that the authentication token won't expire soon,
   * so requests can be safely made to the API.
   */
  protected ensureAuth(): Bluebird<void> {
    return Bluebird.try(() => {
      if(this.authToken && Date.now() < this.authToken.expirationDate - 60) {
        // If the token has still more than one minute before expiration,
        // we don't need to regenerate one
        return;
      }
      // Otherwise, we should (re)generate one
      return this.getAuthToken();
    });
  }

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
}