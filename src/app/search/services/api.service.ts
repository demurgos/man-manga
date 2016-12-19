import * as Bluebird  from 'bluebird';

import {Http}       from '@angular/http';
import {Injectable} from '@angular/core';
import 'rxjs/add/operator/toPromise';

// TODO: Use injectable config
// import {SERVER_URL} from '../../../server/server.config';
const SERVER_URL = "http://localhost:3000";
import {Manga}      from '../../../lib/interfaces/manga.interface';

@Injectable()
export class ApiService /*extends Http*/ {

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
   * Instantiates the service and inject sub-services.
   */
  public constructor(private http: Http) {
    // Nothing else to do
  }
}
