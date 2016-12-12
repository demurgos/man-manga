import * as Bluebird  from 'bluebird';
import * as request   from 'request-promise';

import {MangaCover} from '../../lib/interfaces/manga-cover.interface';

const MCD_COVER_ROOT        = "http://mcd.iosphe.re/n/";
const MCD_FRONT_COVER_TAIL  = "/1/front/a/";

export namespace McdIOSphe {

  /**
   * Returns a JSON object with the requested manga's title
   * and an URL to a known cover of its first volume,
   * wrapped in a Bluebird promise.
   * If no cover is found for the given manga,
   * returns a promise rejection.
   * @param name The manga's name.
   */
  export function getMangaCoverUrl(name: string): Bluebird<MangaCover> {
    return request({
      method: 'POST',
      url: "http://mcd.iosphe.re/api/v1/search/",
      json: true,
      body: {
        Title: name
      }
    })
    .then((body: any) => {
      if(body["Results"].length === 0) {
        return Bluebird.reject(new Error("Manga " + name + " not found"));
      }
      // body["Results"][0][0] : the requested manga's ID according to mcd.iosphe.re
      // http://mcd.iosphe.re/n/{ID}/1/front/a/ : the requested manga's volume 1 cover (in theory)
      // TODO: confirm that the cover url is always the same
      return({
        title: name,
        coverUrl: MCD_COVER_ROOT + body["Results"][0][0] + MCD_FRONT_COVER_TAIL
      });
    })
    .catch((err: Error) => {
      return Bluebird.reject(err);
    });
  }
}
