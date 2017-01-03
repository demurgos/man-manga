import Bluebird = require("bluebird");
import {Request, Response, Router} from "express";
import * as apiInterfaces from "../../lib/interfaces/api/index";
import * as search from "../api/search";
import {anilistApiRouter} from "./api/anilist";
import {manmangaApiRouter} from "./api/manmanga";

export const apiRouter: Router = Router();

/**
 * A test pipeline using specific search.
 */
apiRouter.get("/api/search/:query", async (req: Request, res: Response) => {
  try {
    const query: string = req.params["query"];
    const result: apiInterfaces.search.SearchResult[] = await search.searchAny(query);
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
