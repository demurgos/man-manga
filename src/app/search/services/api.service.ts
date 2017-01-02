import "rxjs/add/operator/toPromise";

import {Inject, Injectable} from "@angular/core";
import {Http} from "@angular/http";
import * as Bluebird  from "bluebird";
import {Anime} from "../../../lib/interfaces/anime.interface";
import {Author} from "../../../lib/interfaces/author.interface";
import {Character} from "../../../lib/interfaces/character.interface";
import {Manga} from "../../../lib/interfaces/manga.interface";
import {SearchResults} from "../../../lib/interfaces/search-result.interface";
import {appConfig, Config} from "../../app.tokens";

import * as url from "url";

@Injectable()
export class ApiService {
  private http: Http;
  private appConfig: Config;

  /**
   * Instantiates the service and inject sub-services.
   */
  public constructor(http: Http, @Inject(appConfig) config: Config) {
    this.http = http;
    this.appConfig = config;
  }

  /**
   * GET /api/pipeline2/:query
   * Search anything related to the keywords and manga/anime,
   * and returns them in an array wrapped in a promise.
   * Returns a promise rejection if there was a problem
   * with the request.
   * The result can be an array full of empty objects.
   * @param query Keywords of the query.
   */
  public search(query: string): Bluebird<SearchResults> {
    return Bluebird
      .try(() => {
        return this.http
          .get(url.format(url.parse(`${this.appConfig.apiBaseUri}/pipeline2/${query}`)))
          .toPromise();
      })
      .then((response: any) => {
        return response.json();
      });
  }

  /**
   * GET /api/sparql/manga/:name
   * Returns the wanted manga,
   * or a Promise rejection if there was a problem with the request
   * (or if no manga could be found).
   * @param name The manga"s name.
   */
  public getManga(name: string): Bluebird<Manga> {
    return Bluebird
      .try(() => {
        return this.http
          .get(url.format(url.parse(`${this.appConfig.apiBaseUri}/manga/${name}`)))
          .toPromise();
      })
      .then((response: any) => {
        return response.json();
      });
  }

  /**
   * GET /api/sparql/anime/:name
   * Returns the wanted anime,
   * or a Promise rejection if there was a problem with the request
   * (or if no anime could be found).
   * @param name The anime's name.
   */
  public getAnime(name: string): Bluebird<Anime> {
    return Bluebird
      .try(() => {
        return this.http
          .get(url.format(url.parse(`${this.appConfig.apiBaseUri}/anime/${name}`)))
          .toPromise();
      })
      .then((response: any) => {
        return response.json();
      });
  }

  /**
   * GET /api/sparql/author/:name
   * Returns the wanted author,
   * or a Promise rejection if there was a problem with the request
   * (or if no author could be found).
   * @param name The author's name.
   */
  public getAuthor(name: string): Bluebird<Author> {
    return Bluebird
      .try(() => {
        return this.http
          .get(url.format(url.parse(`${this.appConfig.apiBaseUri}/author/${name}`)))
          .toPromise();
      })
      .then((response: any) => {
        return response.json();
      });
  }

  /**
   * GET /api/sparql/character/:name
   * Returns the wanted character,
   * or a Promise rejection if there was a problem with the request
   * (or if no character could be found).
   * @param name The character's name.
   */
  public getCharacter(name: string): Bluebird<Character> {
    return Bluebird
      .try(() => {
        return this.http
          .get(url.format(url.parse(`${this.appConfig.apiBaseUri}/character/${name}`)))
          .toPromise();
      })
      .then((response: any) => {
        return response.json();
      });
  }
}
