import * as Bluebird      from 'bluebird';

import {Router}           from 'express';
import {
  IRouterMatcher,
  IRouter}                from "express-serve-static-core";

import {anilistApiRouter} from './server.api.anilist';
import {apiRouter}        from './server.api.manmanga';
import {DBPedia}          from '../lib/dbpedia';
import {McdIOSphe}        from '../lib/mcd-iosphe';
import {MangaCover}       from '../../lib/interfaces/manga-cover.interface';

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
  Google
    .query(query + " manga OR anime", "en.wikipedia.org")
    .then((result: string[]) => {
      return Bluebird.all(result.slice(0, 3).map((url: string) => {
        return DBPedia.Search.search(DBPedia.Utils.wikiUrlToResourceUrl(url));
      }));
    })
    .then((results: DBPedia.Search.Result[]) => {
      return Bluebird.all(results.map((result: DBPedia.Search.Result) => {
        const manga = result.manga;   // Need a const because of the promise
        if(result && manga) {
          return McdIOSphe
            .getMangaCoverUrl(DBPedia.Utils.resourceUrlToName(manga.title))
            .then((cover: MangaCover) => {
              manga.coverUrl = cover.coverUrl;
              result.manga = manga;
              return result;
            })
            .catch((err: Error) => {
              // At this point, it's not a problem if we don't find any cover
              // Just return the result
              // TODO: try to get something with anilist ?
              return result;
            });
        }
        return result;
      }));
    })
    .then((result: any) => {
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
