import Bluebird= require('bluebird');
import watson = require('watson-developer-cloud');

export type LanguageCode = "de" | "it" | "nl" | "ru" | "es" | "pt" | "hu" | "tr" | "fr" | "en";

export interface Result {
  url: string;
  language: LanguageCode;
  text: string;
}

const LANGUAGE_TO_CODE: {[lang: string]: LanguageCode} = {
  "french": "fr",
  "english": "en",
  "german":"de",
  "dutch":"nl",
  "italian":"it",
  "russian":"ru",
  "spanish":"es",
  "portuguese":"pt",
  "turkish":"tr",
  "hungarian":"hu"
};

export function getTextFromURL(url: string): Bluebird<Result> {
  const alchemy_language = watson.alchemy_language({
    api_key: 'd1318ceb349318b5ab6b35ced1640cd8a76aa56e' // nicolas'key available for up to 1000 request a day
  });

  const parameters: watson.TextOptions = {
    url: url
  };

  return Bluebird
    .fromCallback<watson.TextResult>((cb) => {
      alchemy_language.text(parameters, cb);
    })
    .then(result => {
      if(result.status === "ERROR") {
        throw new Error("Error status");
      }
      let lang:LanguageCode;
      if (result.language in LANGUAGE_TO_CODE) {
        lang = LANGUAGE_TO_CODE[result.language];
      } else {
        lang = "en";
      }

      let ret:Result = {
        url: result.url,
        text: result.text,
        language: lang
      };

      return ret;
    });

}

