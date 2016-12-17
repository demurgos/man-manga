import * as io from "../../lib/interfaces/io";
import {MangaCover} from "../../lib/interfaces/manga-cover.interface";
import requestIO from "./request-io";

const mcdCoverRoot: string = "http://mcd.iosphe.re/n/";
const mcdFontCoverTail: string = "/1/front/a/";

/**
 * Returns a JSON object with the requested manga's title
 * and an URL to a known cover of its first volume,
 * wrapped in a Bluebird promise.
 * If no cover is found for the given manga,
 * returns a promise rejection.
 * @param name The manga's name.
 */
export async function getMangaCoverUrl(name: string): Promise<MangaCover> {
  const requestOptions: io.PostOptions = {
    uri: "http://mcd.iosphe.re/api/v1/search/",
    body: {
      Title: name
    }
  };

  const response: io.Response = await requestIO.post(requestOptions);
  const data: any = JSON.parse(response.body);
  if (data.Results.length === 0) {
    throw new Error(`Mange ${name} not found`);
  }
  // body["Results"][0][0] : the requested manga's ID according to mcd.iosphe.re
  // http://mcd.iosphe.re/n/{ID}/1/front/a/ : the requested manga's volume 1 cover (in theory)
  // TODO: confirm that the cover url is always the same
  return {
    title: name,
    // TODO: use path.posix.join
    coverUrl: mcdCoverRoot + data.Results[0][0] + mcdFontCoverTail
  };
}
