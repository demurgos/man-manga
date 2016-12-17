import google = require("google");
import Bluebird = require("bluebird");

export interface Item {
  title: string;
  snippet: string;
  link: string;
}

export async function query(query: string): Promise<Item[]> {
  const googleResult: google.Result = await Bluebird.fromCallback((cb) => google(query, cb));

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
}
