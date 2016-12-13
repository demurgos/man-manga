import * as Bluebird  from 'bluebird';

import {Http}       from '@angular/http';
import {Injectable} from '@angular/core';

// import {SERVER_URL} from '../../../server/server.config';
// TODO: fix build tools so we can import things from server.config
const SERVER_URL = "http://localhost:3000";
import {Manga}      from '../../../lib/interfaces/manga.interface';

@Injectable()
export class ApiService /*extends Http*/{

  /**
   * GET /api/sparql/manga/:name
   * Returns the wanted manga,
   * or a Promise rejection if there was a problem with the request
   * (or if no manga could be found).
   * @param name The manga's name.
   */
  public getManga(name: string): Bluebird<void> {
    return Bluebird.try(() => {
      //return this.get(SERVER_URL + "/api/sparql/manga/" + name);
    })
    .then((response: any) => {
      console.log(response);
    });
  }
}