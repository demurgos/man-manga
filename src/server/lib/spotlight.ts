import * as cheerio from "cheerio";
import {posix as path} from "path";
import * as url from "url";
import * as io from "../../lib/interfaces/io";
import requestIO from "./request-io";

const API_PROTOCOL: string = "http";
const API_HOST: string = "dbpedia-spotlight.com";

/**
 *
 * @param text
 * @param language
 * @returns {string []}
 */
export async function query(text: string, language: string): Promise<string[]> {
  const apiPath: string = path.join("/", language, "annotate");
  const apiUri: string = url.format({protocol: API_PROTOCOL, host: API_HOST, pathname: apiPath});

  const ioOptions: io.GetOptions = {
    uri: apiUri,
    queryString: {
      text: text, // Text to analyze
      confidence: "0.8", // Confidence of the return URI (btw 0 and 1)
      support: "0", // Min number of incoming links require
      spotter: "Default", // ???
      disambiguator: "Default", // ???
      policy: "whiteliste", // ???
      types: "", // DBpedia type.
      sparql: "" // Potential sparql request to eliminate some returns URI
    }
  };

  const response: io.Response = await requestIO.get(ioOptions);

  return scrapResult(response.body);
}

function scrapResult(html: string): string[] {
  const links: string[] = [];

  const $: CheerioSelector = cheerio.load(html);

  $("a").each((index: number, element: CheerioElement) => {
    const href: string = $(element).attr("href");
    links.push(href);
  });

  return links;
}
