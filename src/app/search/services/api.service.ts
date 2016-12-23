import * as Bluebird  from 'bluebird';
import 'rxjs/add/operator/toPromise';

import {Http}       from '@angular/http';
import {Injectable} from '@angular/core';

import {Manga}      from '../../../lib/interfaces/manga.interface';
import {Anime}      from "../../../lib/interfaces/anime.interface";
import {Author}     from "../../../lib/interfaces/author.interface";
import {Character}  from "../../../lib/interfaces/character.interface";

// TODO: Use injectable config
// import {SERVER_URL} from '../../../server/server.config';
const SERVER_URL = "http://localhost:3000";

@Injectable()
export class ApiService {

  /**
   * GET /api/sparql/manga/:name
   * Returns the wanted manga,
   * or a Promise rejection if there was a problem with the request
   * (or if no manga could be found).
   * @param name The manga's name.
   */
  public getManga(name: string): Bluebird<Manga> {
    return Bluebird
      .try(() => {
        return this.http
          .get(SERVER_URL + "/api/sparql/manga/" + name)
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
          .get(SERVER_URL + "/api/sparql/anime/" + name)
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
          .get(SERVER_URL + "/api/sparql/author/" + name)
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
          .get(SERVER_URL + "/api/sparql/character/" + name)
          .toPromise();
      })
      .then((response: any) => {
        return response.json();
      });
  }

  /**
   * Instantiates the service and inject sub-services.
   */
  public constructor(private http: Http) {
    // Nothing else to do
  }
}
