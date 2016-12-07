import * as googleSearch from "./googlesearch";

googleSearch.query("goku")
  .then(console.log, console.error);
