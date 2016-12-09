import * as alchemy from "./alchemy";

console.log("alchemy");

alchemy.getTextFromURL('https://fr.wikipedia.org')
  .then(console.log);

// console.log(textFromUrl);
