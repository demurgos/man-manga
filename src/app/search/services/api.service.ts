import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import * as Bluebird  from "bluebird";
import {Manga} from "../../../lib/interfaces/manga.interface";

const serverUrl: string = "http://localhost:3000";

@Injectable()
export class ApiService { // TODO: use Http service and inject app config
  /**
   * GET /api/sparql/manga/:name
   * Returns the wanted manga,
   * or a Promise rejection if there was a problem with the request
   * (or if no manga could be found).
   * @param name The manga's name.
   */
  public getManga(name: string): Bluebird<void> {
    return Bluebird
      .try(() => {
        // return this.get(SERVER_URL + "/api/sparql/manga/" + name);
      })
      .then((response: any) => {
        console.log(response);
      });
  }
}
