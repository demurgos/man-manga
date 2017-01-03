import Bluebird = require("bluebird");
import {Request, Response, Router} from "express";
import * as apiInterfaces from "../../lib/interfaces/api/index";
import api from "../api/index";
import * as DBPedia from "../lib/dbpedia/search";
import {anilistApiRouter} from "./api/anilist";
import {manmangaApiRouter} from "./api/manmanga";

export const apiRouter: Router = Router();

/**
 * GET /api/test
 * Just a test endpoint to see if the API is available.
 * Returns a JSON object.
 */
apiRouter.get("/api/test", async (req: Request, res: Response) => {
  res.status(200).json({"api-call": "You got it!"});
});

/**
 * A test pipeline using alchemy + spotlight.
 */
apiRouter.get("/api/pipeline/:query", async (req: Request, res: Response) => {
  res.status(500).json({error: {name: "error", message: "Use /api/pipeline2/query"}});
});

/**
 * A test pipeline using specific search.
 */
apiRouter.get("/api/pipeline2/:query", async (req: any, res: Response) => {
  try {
    const query: string = req.params["query"];
    const result: apiInterfaces.search.SearchResult[] = await api.search(query);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({error: {name: err.name, stack: err.stack}});
    console.error(err);
  }
});

/**
 * Register sub-routers.
 */
apiRouter.use("/api", manmangaApiRouter);
apiRouter.use("/api/anilist", anilistApiRouter);

export default apiRouter;
