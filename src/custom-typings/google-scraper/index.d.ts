declare module "google-scraper" {
  export interface Options {
    keyword: string;
    language: "en" | "fr" | string;
    tld: "com" | "fr" | string;
    results: number;
  }

  export class GoogleScraper {
    constructor(options: Options);
    getHtml(): Promise<any>;
    extractLink(html: any): Promise<string[]>;
    getGoogleLinks(): Promise<string[]>;
  }
}
