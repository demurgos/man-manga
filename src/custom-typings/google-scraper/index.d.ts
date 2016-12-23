declare module "google-scraper" {
  export namespace Scraper {
    export interface Options {
      keyword: string,
      language: "en" | "fr" | string,
      tld: "com" | "fr" | string,
      results: number
    }

    export type Link = string;

    export type Links = Link[];

    export class GoogleScraper {
      constructor(options: Options);
      getHtml: () => Promise<any>;
      extractLink: (html: any) => Promise<Links>;
      getGoogleLinks: Promise<Links>;
    }
  }

  export = Scraper;

}