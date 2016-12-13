declare module "google" {
  declare namespace google {
    export interface Options {

    }

    export interface Item {
      title: string;
      link: string | null;
      description: string;
      href: string | null;
    }

    export interface Result {
      /**
       * Url used for the GET request
       */
      url: string;

      /**
       * Search query
       */
      query: string;

      /**
       * Index of the first element
       */
      start: number;

      /**
       * List of links on the page.
       */
      links: Item[];

      /**
       * Cheerio instance
       */
      $: any;

      /**
       * Body of the HTML response.
       */
      body: string;

      /**
       * Function to get the next results
       */
      next: () => any;
    }
  }

  declare interface Google {
    (query: string, callback?: () => any);
    (query: string, callback?: (err: Error) => any);
    (query: string, callback?: (err: Error | null, res: google.Result) => any);
  }

  declare const google: Google;

  export = google;
}