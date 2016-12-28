import google = require("google");
import Bluebird = require("bluebird");
import {GoogleScraper} from "google-scraper";

export async function query(query: string, site?: string): Promise<string[]> {
  if (site === undefined) {
    query += " site:" + site;
  }

  const scraper: GoogleScraper = new GoogleScraper({
    keyword: query,
    language: "en",
    tld: "com",
    results: 10
  });

  return scraper.getGoogleLinks();
}
