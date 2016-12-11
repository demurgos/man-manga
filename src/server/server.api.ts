import * as request from 'request';
import * as _ from 'lodash';

import {Router} from 'express';
import {Manga}  from "../lib/interfaces/manga.interface";

const router: Router = Router();

/**
 * GET /api/test
 * Just a test endpoint to see if the API is available.
 * Returns a JSON object.
 */
router.get("/api/test", (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).send(JSON.stringify({"api-call": "You got it!"}, null, 2));
});

/**
 * GET / api/sparql/isManga/:resource
 *    :resource  The resource to analyze
 * Identify if the given resource is known as a manga,
 * according to dbpedia.
 * Beware, result may vary with the case used to write the resource's name.
 * Returns a JSON with fields:
 *    resource: the resource's name.
 *    isManga : whether the given resource is a manga or not.
 * Or 404 if there was an error with the request.
 */
router.get("/api/sparql/isManga/:resource", (req, res, next) => {
  let resource = req.params["resource"];
  let query: string = "select distinct ?p ?o where {" +
    "values ?title {dbr:" + resource + "}." +
    "?title rdf:type dbo:Manga." +
    "?title ?p ?o. }";
  res.setHeader('Content-Type', 'application/json');
  request({
    url: "http://dbpedia.org/sparql?query=" + query + "&format=application/json",
    json: true
  }, (err, response, body) => {
    if (err) {
      console.log("ERROR with the request");
      res.status(404).send(err);
    } else {
      if (body["results"]["bindings"].length === 0) {
        res.status(200).send(JSON.stringify({
          resource: resource,
          isManga: false
        }, null, 2));
      } else {
        res.status(200).send(JSON.stringify({
          resource: resource,
          isManga: true
        }, null, 2));
      }
    }
  });
});

/**
 * GET api/sparql/manga/:name
 *    :name  The name of the manga (according to dbpedia; beware of the case)
 *
 * Known issues:
 *    The request refuse to send more fields than 6.
 *    This results in the field "publisher" missing.
 */
router.get("/api/sparql/manga/:name", (req, res, next) => {
  let manga = req.params["name"];
  let query: string = "select distinct ?title ?author ?volumes ?publicationDate ?illustrator ?abstract ?publisher"
    + "where {"
    + "values ?title {dbr:" + manga + "}. "
    + "?title a dbo:Manga. "
    + "OPTIONAL { ?title dbo:author ?author }. "
    + "OPTIONAL { ?title dbo:numberOfVolumes ?volumes }. "
    + "OPTIONAL { ?title dbo:firstPublicationDate ?publicationDate }. "
    + "OPTIONAL { ?title dbo:illustrator ?illustrator }. "
    + "OPTIONAL { ?title dbo:publisher ?publisher }. "
    + "OPTIONAL { ?title dbo:abstract ?abstract. filter(langMatches(lang(?abstract),'en')) }. "
    + "}";
  res.setHeader('Content-Type', 'application/json');
  request({
    url: "https://dbpedia.org/sparql?query=" + query + "&format=application/json",
    json: true
  }, (err, response, body) => {
    if (err) {
      console.log("ERROR with the request");
      res.status(404).send(err);
    } else {
      manga = sparqlToManga(crossArray(body["results"]["bindings"]));
      res.status(200).send(JSON.stringify(manga, null, 2));
    }
  });
});

export const apiRouter = router;

function sparqlToManga(sparqlResult: any): Manga {
  let manga: Manga = {
    title: "",
    author: {
      name: ""
    }
  };
  for(let key in sparqlResult[0]) {
    if (!sparqlResult[0].hasOwnProperty(key)) continue;
    if(sparqlResult[0][key].length === 1) {
      manga[key] = sparqlResult[0][key][0];
    } else if(key === "publicationDate") {
      manga[key] = _.min(sparqlResult[0][key]);
    } else if(key === "snippet") {
      manga[key] = sparqlResult[0][key][0];
    } else if(key === "volumes") {
      manga[key] = _.max(sparqlResult[0][key]);
    } else {
      manga[key] = sparqlResult[0][key];
    }
  }
  return manga;
}

/**
 * Transform an array of same type objects in a object with arrays as fields,
 * deleting duplicated values in the process.
 * @param sparqlResult the raw result sent by dbpedia.
 */
function crossArray(sparqlResult: any[]): any[] {
  let res: any[] = [{}];
  let first: boolean = true;
  for(let object of sparqlResult) {
    for(let key in object) {
      if (!object.hasOwnProperty(key)) continue;
      if(first) {
        res[0][key] = [object[key]["value"]];
      } else {
        if(res[0][key].indexOf(object[key]["value"]) !== -1) continue;
        res[0][key].push(object[key]["value"]);
      }
    }
    first = false;
  }
  return res;
}


// wikiPageID => can be interesting!