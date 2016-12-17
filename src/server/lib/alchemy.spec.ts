import * as alchemy from "./alchemy";

alchemy.getTextFromURL("https://fr.wikipedia.org")
  .then(console.log);
