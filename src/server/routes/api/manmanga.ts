import { Request, Response, Router} from "express";
import * as apiInterfaces from "../../../lib/interfaces/api/index";
import * as io from "../../../lib/interfaces/io";
import {Anime, Author, Character, Manga, MangaCover} from "../../../lib/interfaces/resources/index";
import * as search from "../../api/search";
import * as dbpedia from "../../lib/dbpedia/index";
import * as mcdIOSphe from "../../lib/mcd-iosphere";
import requestIO from "../../lib/request-io";

export const manmangaApiRouter: Router = Router();

/**
 * GET /isManga/:resource
 *    :resource  The resource to analyze
 * Identify if the given resource is known as a manga,
 * according to dbpedia.
 * Beware, result may vary with the case used to write the resource's name.
 * Returns a JSON with fields:
 *    resource: the resource's name.
 *    isManga : whether the given resource is a manga or not.
 * Or 500 if there was an error with the request.
 */
manmangaApiRouter.get("/isManga/:resource", async function (req: Request, res: Response) {
  // TODO: move the logic to src/server/api
  try {
    const results: Manga[] = await search.searchManga(req.params["resource"]);
    if (results.length > 0) {
      res.status(200).json({isManga: true, result: results[0]});
    } else {
      res.status(200).json({isManga: false, result: null});
    }
  } catch (err) {
    res.status(500).json({error: {name: err.name, stack: err.stack}});
  }
});

manmangaApiRouter.get("/resource/:name", async function (req: Request, res: Response) {
  try {
    const query: string = req.params["name"];
    const results: apiInterfaces.search.SearchResult[] = await search.searchResource(query);
    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).json({error: {name: "resource-not-found", message: `${query} not found`}});
    }
  } catch (err) {
    res.status(500).json({error: {name: err.name, stack: err.stack}});
  }
});

/**
 * GET /anime/:name
 *    :name  The name of the anime (according to dbpedia; beware of the case)
 * Gather all available information about the anime named ':name'.
 * Returns an anime as JSON,
 * or a 404 error if there was a problem with the request.
 */
manmangaApiRouter.get("/anime/:name", async function (req: Request, res: Response) {
  try {
    const query: string = req.params["name"];
    const results: Anime[] = await search.searchAnime(query);
    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).json({error: {name: "resource-not-found", message: `${query} not found`}});
    }
  } catch (err) {
    res.status(500).json({error: {name: err.name, stack: err.stack}});
  }
});

/**
 * GET /author/:name
 *    :name  The name of the author (according to dbpedia; beware of the case)
 * Gather all available information about the author named ':name'.
 * Returns an author as JSON,
 * or a 500 error if there was a problem with the request.
 */
manmangaApiRouter.get("/author/:name", async function (req: Request, res: Response) {
  try {
    const query: string = req.params["name"];
    const results: Author[] = await search.searchAuthor(query);
    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).json({error: {name: "resource-not-found", message: `${query} not found`}});
    }
  } catch (err) {
    res.status(500).json({error: {name: err.name, stack: err.stack}});
  }
});

/**
 * GET /character/:name
 *    :name  The name of the character (according to dbpedia; beware of the case)
 * Gather all available information about the character named ':name'.
 * Returns a character as JSON,
 * or a 404 error if there was a problem with the request.
 */
manmangaApiRouter.get("/character/:name", async function (req: Request, res: Response) {
  try {
    const query: string = req.params["name"];
    const results: Character[] = await search.searchCharacter(query);
    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).json({error: {name: "resource-not-found", message: `${query} not found`}});
    }
  } catch (err) {
    res.status(500).json({error: {name: err.name, stack: err.stack}});
  }
});

/**
 * GET /manga/:name
 *    :name  The name of the manga (according to dbpedia; beware of the case)
 * Gather all available information about the manga named ':name'.
 * Returns a manga as JSON,
 * or a 500 error if there was a problem with the request.
 */
manmangaApiRouter.get("/manga/:name", async function (req: Request, res: Response) {
  try {
    const query: string = req.params["name"];
    const results: Manga[] = await search.searchManga(query);
    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).json({error: {name: "resource-not-found", message: `${query} not found`}});
    }
  } catch (err) {
    res.status(500).json({error: {name: err.name, stack: err.stack}});
  }
});

/**
 * GET /manga/:name/coverUrl
 *    :name The name of the manga (according to mcd.iosphe; beware, don't use '_').
 * Gather the manga's first volume front cover.
 * Returns a JSON with fields:
 *    title: the manga's name.
 *    coverUrl : an url to the manga's first volume front cover.
 * Or 404 if there was an error with the request.
 */
manmangaApiRouter.get("/manga/:name/coverUrl", async function (req: Request, res: Response) {
  try {
    const query: string = req.params["name"];
    const results: Manga[] = await search.searchManga(query);
    if (results.length > 0) {
      const cover: MangaCover = await mcdIOSphe.getMangaCoverUrl(results[0].title);
      res.status(200).json(cover);
    } else {
      res.status(404).json({error: {name: "resource-not-found", message: `${query} not found`}});
    }
  } catch (err) {
    res.status(500).json({error: {name: err.name, stack: err.stack}});
  }
});
