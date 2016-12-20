import {Router}           from 'express';
import {
  IRouterMatcher,
  IRouter}                from "express-serve-static-core";

import {anilistApiRouter} from './server.api.anilist';
import {apiRouter}  from './server.api.manmanga';

import * as Google from '../lib/googlesearch';

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
 * A test pipeline
 */
router.get("/api/pipeline/:query", (req: any, res: any) => {
  let query: string = req.params["query"];
  Google
    .query(query)
    .then((result: any) => {
      console.log(result);
      res.status(200).send(JSON.stringify(result, null, 2));
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
