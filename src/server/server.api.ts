import {Router} from 'express';

import * as request from 'request';

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
 * Identify if teh given resource is known as a manga.
 * Beware, result may vary with the case used to write the resource's name.
 * Returns a JSON with fields:
 *    resource: the resource's name.
 *    isManga : whether the given resource is a manga or not.
 * Or 404 if there was an eror with the request.
 */
router.get("/api/sparql/isManga/:resource", (req, res, next) => {
  let resource = req.params["resource"];
  let query: string = "select distinct ?p ?o where {" +
    "values ?resource {dbr:" + resource + "}." +
    "?resource rdf:type dbo:Manga." +
    "?resource ?p ?o. }";
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
 * GET api/sqparl/manga/:name
 *    :name  The name of the manga (according to dbpedia; beware of the case)
 *
 */
router.get("/api/sparql/manga/:name", (req, res, next) => {
  let manga = req.params["name"];

  res.setHeader('Content-Type', 'application/json');
  res.status(200).send(JSON.stringify({"api-call": "You got it!"}, null, 2));
});

export const apiRouter = router;