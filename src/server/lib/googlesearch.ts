import google = require("google");
import Bluebird = require("bluebird");
import Scraper = require("google-scraper");

export function query(query: string, site?: string): Bluebird<Scraper.Links> {
  if(site) {
    query += " site:" + site;
  }
  let scrape = new Scraper.GoogleScraper({
    keyword: query,
    language: "en",
    tld: "com",
    results: 10
  });
  return Bluebird.resolve(
    scrape
      .getGoogleLinks
      .then((results: Scraper.Links) => {
        return results;
      }))
    .catch((err: any) => {
      console.log("ERROR");
      console.log(err);
    });
}
