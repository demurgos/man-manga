import Bluebird = require("bluebird");
import {Request, Response, Router} from "express";
import {MangaCover} from "../../lib/interfaces/manga-cover.interface";
import {Manga} from "../../lib/interfaces/manga.interface";
import * as alchemy from "../lib/alchemy";
import * as DBPedia from "../lib/dbpedia";
import * as googlesearch from "../lib/googlesearch";
import * as McdIOSphere from "../lib/mcd-iosphere";
import * as spotlight from "../lib/spotlight";
import {anilistApiRouter} from "./server.api.anilist";
import {manmangaApiRouter} from "./server.api.manmanga";

export const apiRouter: Router = Router();

/**
 * GET /api/test
 * Just a test endpoint to see if the API is available.
 * Returns a JSON object.
 */
apiRouter.get("/api/test", async function (req: Request, res: Response) {
  res.status(200).json({"api-call": "You got it!"});
});

/**
 * A test pipeline using alchemy + spotlight.
 */
apiRouter.get("/api/pipeline/:query", async function (req: Request, res: Response) {
  try {
    const query: string = req.params["query"];
    console.log("QUERYING...");
    const searchResult: string[] = await googlesearch.query(query);
    console.log(searchResult);
    console.log("ALCHEMYING...");
    // TODO: handle empty array
    const alchemyResult: alchemy.Result = await alchemy.getTextFromURL(searchResult[0]);
    console.log(alchemyResult);
    console.log("SPOTLIGHTING...");
    const spotlightResult: string[] = await spotlight.query(alchemyResult.text, alchemyResult.language);
    console.log(spotlightResult);
    res.status(200).json(spotlightResult);
  } catch (err) {
    res.status(500).json(err);
  }
});

/**
 * A test pipeline using specific search.
 */
apiRouter.get("/api/pipeline2/:query", async function (req: Request, res: Response) {
  try {
    const query: string = req.params["query"];
    const searchResult: string[] = await googlesearch.query(`${query} manga OR anime`, "en.wikipedia.org");
    const dbpediaResultPromises: Promise<DBPedia.SearchResult>[] = searchResult
      .slice(0, 3)
      .map(async function (url: string) {
        const dbpediaResult: DBPedia.SearchResult = await DBPedia.search(DBPedia.wikiUrlToResourceUrl(url));
        if (dbpediaResult && dbpediaResult.manga !== undefined) {
          const manga: Manga = dbpediaResult.manga;
          try {
            const cover: MangaCover = await McdIOSphere.getMangaCoverUrl(DBPedia.resourceUrlToName(manga.title));
            manga.coverUrl = cover.coverUrl;
          } catch (err) {
            // At this point, it's not a problem if we don't find any cover
            // Just return the result
            // TODO: try to get something with anilist ?
          }
        }
        return dbpediaResult;
      });

    const dbpediaResults: DBPedia.SearchResult[] = await Promise.all(dbpediaResultPromises);
    res.status(200).json(dbpediaResults);
  } catch (err) {
    res.status(500).json(err);
  }
});

/**
 * Register sub-routers.
 */
apiRouter.use("/api", manmangaApiRouter);
apiRouter.use("/api/anilist", anilistApiRouter);

export default apiRouter;
