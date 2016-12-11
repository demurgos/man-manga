import * as request   from 'request-promise';
import * as _         from 'lodash';

import {Router}   from 'express';
import {Manga}    from '../lib/interfaces/manga.interface';
import {DBPedia}  from './lib/dbpedia';

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
  })
  .then((body: any) => {
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
  })
  .catch((err: any) => {
    console.log("ERROR with the request");
    res.status(404).send(err);
  });
});

/**
 * GET api/sparql/manga/:name
 *    :name  The name of the manga (according to dbpedia; beware of the case)
 *
 * Known issues:
 *    The request to dbpedia refuses to send more fields than 6.
 */
router.get("/api/sparql/manga/:name", (req: any, res: any, next: any) => {
  let mangaName = req.params["name"];
  res.setHeader('Content-Type', 'application/json');
  DBPedia.Manga
    .retrieve(mangaName)
    .then((manga: Manga) => {
      res.status(200).send(JSON.stringify(manga, null, 2));
    })
    .catch((err: any) => {
      console.log("ERROR with the request from /api/sparql/manga/" + mangaName);
      res.status(404).send(err);
    });
});

export const apiRouter = router;

// wikiPageID => can be interesting!