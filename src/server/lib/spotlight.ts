import * as url         from "url";
import * as io          from "../../lib/interfaces/io";
import * as cheerio     from "cheerio";
import {posix as path}  from "path";
import {requestIO}      from "./request-io";

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
  const apiUri = url.format({protocol: API_PROTOCOL, host: API_HOST, pathname: apiPath});

  const ioOptions: io.PostOptions = {
    uri: apiUri,
    form: {
      text: text.substr(0, 500), // Text to analyze
      confidence: "0.5", // Confidence of the return URI (btw 0 and 1)
      support: "0", // Min number of incoming links require
      spotter: "Default", // ???
      disambiguator: "Default", // ???
      policy: "whiteliste", // ???
      types: "", // DBpedia type. http://dbpedia.org/ontology/Manga
      sparql: "", // Potential sparql request to eliminate some returned URI
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json"
    }
  };

  const response: io.Response = await requestIO.post(ioOptions);

  return scrapJsonResult(JSON.parse(response.body)["Resources"]);
}

function scrapHtmlResult(html: string): string[] {
  const links: string[] = [];

  const $ = cheerio.load(html);

  $("a").each((index: number, element: CheerioElement) => {
    const href: string = $(element).attr("href");
    links.push(href);
  });

  return links;
}

function scrapJsonResult(result: any[]): string[] {
  let res: any[] = [];
  for(let object of result) {
    res.push(object["@URI"]);
  }
  return res;
}
