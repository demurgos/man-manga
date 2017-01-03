import * as apiInterfaces from "../../lib/interfaces/api/index";
import {search as search} from "./search";

export const api: apiInterfaces.Api = {
  search: function(query: string): Promise<apiInterfaces.search.SearchResult[]> {
    return search(query);
  }
};

export default api;
