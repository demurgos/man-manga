import google = require("google");
import Bluebird = require("bluebird");
import Scraper = require("google-scraper");

export function query(query: string): Bluebird<Scraper.Links> {
  console.log("QUERYING......");
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

// --------- OLD SCRAPING TOOL

export interface Item {
  title: string;
  snippet: string;
  link: string;
}

/*return Bluebird
  .fromCallback(cb => google(query, cb))
  .then((googleResult: google.Result) => {
    console.log(googleResult);
    const items: Item[] = [];

    for (const link of googleResult.links) {
      if (link.href !== null) {
        items.push({
          title: link.title,
          snippet: link.description,
          link: link.href
        });
      }
    }

    return items;
  })
  .catch((err: any) => {
    console.log(err);
    return Bluebird.reject(err);
  });*/
