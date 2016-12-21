import {Router}           from 'express';
import {
  IRouterMatcher,
  IRouter}                from "express-serve-static-core";

import {anilistApiRouter} from './server.api.anilist';
import {apiRouter}        from './server.api.manmanga';

import * as Google        from '../lib/googlesearch';
import * as Alchemy       from '../lib/alchemy';
import * as Spotlight     from '../lib/spotlight';

const router: Router = Router();

/**
 * GET /api/test
 * Just a test endpoint to see if the API is available.
 * Returns a JSON object.
 */
router.get("/api/test", (req: any, res: any) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).send(JSON.stringify({"api-call": "You got it!"}, null, 2));
});

/**
 * A test pipeline using Alchemy + Spotlight.
 */
router.get("/api/pipeline/:query", (req: any, res: any) => {
  let query: string = req.params["query"];
  res.setHeader('Content-Type', 'application/json');
  console.log("QUERYING...");
  Google
    .query(query)
    .then((result: any) => {
      console.log(result);
      console.log("ALCHEMYING...");
      return Alchemy.getTextFromURL(result[0]);
    })
    .then((result: Alchemy.Result) => {
      console.log(result);
      console.log("SPOTLIGHTING...");
      return Spotlight.query(result.text, result.language);
    })
    .then((result: string[]) => {
      console.log(result);
      res.status(200).send(result);
    })
    .catch((err: any) => {
      res.status(500).send(err);
    });
});

/**
 * A test pipeline using specific search.
 */
router.get("/api/pipeline2/:query", (req: any, res: any) => {
  let query: string = req.params["query"];
  res.setHeader('Content-Type', 'application/json');
  console.log("QUERYING...");
  Google
    .query(query, "en.wikipedia.org")
    .then((result: any) => {
      console.log(result);
      res.status(200).send(result);
    })
    .catch((err: any) => {
      res.status(500).send(err);
    });
});

/**
 * Mount sub-routers.
 */
(<IRouterMatcher<IRouter>> router.use)('/api', apiRouter);
(<IRouterMatcher<IRouter>> router.use)('/api/anilist', anilistApiRouter);

export const globalApiRouter = router;
