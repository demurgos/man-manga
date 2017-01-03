import * as search from "./search";

export interface Api {
  search(query: string): Promise<search.SearchResult[]>;
}

export {search};
