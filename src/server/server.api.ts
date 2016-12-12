import * as request   from 'request-promise';

import {Router}     from 'express';
import {Manga}      from '../lib/interfaces/manga.interface';
import {Anime}      from '../lib/interfaces/anime.interface';
import {Author}     from '../lib/interfaces/author.interface';
import {Character}  from '../lib/interfaces/character.interface';
import {MangaCover} from '../lib/interfaces/manga-cover.interface';
import {DBPedia}    from './lib/dbpedia';
import {McdIOSphe}  from './lib/mcd-iosphe';
import {AnilistApi} from './lib/anilist-api.class';

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
 * Gather all available information about the manga named ':name'.
 * Returns a manga as JSON,
 * or a 404 error if there was a problem with the request.
 */
//TODO: if the manga is unknown of dbpedia, but known to McdIOSphere,
//      this will still returns a coverURL => correct this ?
router.get("/api/sparql/manga/:name", (req: any, res: any, next: any) => {
  let mangaName: string = req.params["name"];
  let result: Manga;
  res.setHeader('Content-Type', 'application/json');
  DBPedia.Manga
    .retrieve(mangaName)
    .catch((err: any) => {
      console.log("ERROR with the request from /api/sparql/manga/" + mangaName);
      res.status(404).send(err);
    })
    .then((manga: Manga) => {
      result = manga;
      return McdIOSphe.getMangaCoverUrl(mangaName.replace('_', ' '));
    })
    .then((cover: MangaCover) => {
      result.coverUrl = cover.coverUrl;
      res.status(200).send(JSON.stringify(result, null, 2));
    })
    .catch((err: any) => {
      // At this point, the error is coming from McdIOSphere;
      // but we can still return the manga without any coverUrl
      console.log(err);
      res.status(200).send(JSON.stringify(result, null, 2));
    });
});

/**
 * GET api/sparql/anime/:name
 *    :name  The name of the anime (according to dbpedia; beware of the case)
 * Gather all available information about the anime named ':name'.
 * Returns an anime as JSON,
 * or a 404 error if there was a problem with the request.
 */
router.get("/api/sparql/anime/:name", (req: any, res: any, next: any) => {
  let animeName = req.params["name"];
  res.setHeader('Content-Type', 'application/json');
  DBPedia.Anime
    .retrieve(animeName)
    .then((anime: Anime) => {
      res.status(200).send(JSON.stringify(anime, null, 2));
    })
    .catch((err: any) => {
      console.log("ERROR with the request from /api/sparql/anime/" + animeName);
      res.status(404).send(err);
    });
});

/**
 * GET api/sparql/author/:name
 *    :name  The name of the author (according to dbpedia; beware of the case)
 * Gather all available information about the author named ':name'.
 * Returns an author as JSON,
 * or a 404 error if there was a problem with the request.
 */
router.get("/api/sparql/author/:name", (req: any, res: any, next: any) => {
  let authorName = req.params["name"];
  res.setHeader('Content-Type', 'application/json');
  DBPedia.Author
    .retrieve(authorName)
    .then((author: Author) => {
      res.status(200).send(JSON.stringify(author, null, 2));
    })
    .catch((err: any) => {
      console.log("ERROR with the request from /api/sparql/author/" + authorName);
      res.status(404).send(err);
    });
});

/**
 * GET api/sparql/character/:name
 *    :name  The name of the character (according to dbpedia; beware of the case)
 * Gather all available information about the character named ':name'.
 * Returns a character as JSON,
 * or a 404 error if there was a problem with the request.
 */
router.get("/api/sparql/character/:name", (req: any, res: any, next: any) => {
  let characterName = req.params["name"];
  res.setHeader('Content-Type', 'application/json');
  DBPedia.Character
    .retrieve(characterName)
    .then((character: Character) => {
      res.status(200).send(JSON.stringify(character, null, 2));
    })
    .catch((err: any) => {
      console.log("ERROR with the request from /api/sparql/character/" + characterName);
      res.status(404).send(err);
    });
});

/**
 * GET /api/character/:name
 *    :name The character's name.
 * Gather all available information about the character ':name',
 * according to anilist.
 * Meant to research a character with a precise name.
 */
const anilistAPI = new AnilistApi();  // TODO: what about multiple queries at the same time with an expired token ?
router.get("/api/character/:name", (req: any, res: any, next: any) => {
  let characterName: string = req.params["name"];
  anilistAPI
    .getCharacter(characterName)
    .then((character: Character) => {
      res.status(200).send(character);
    });
});

/**
 * GET /api/manga/:name/coverUrl
 *    :name The name of the manga (according to mcd.iosphe; beware, don't use '_').
 * Gather the manga's first volume front cover.
 * Returns a JSON with fields:
 *    title: the manga's name.
 *    coverUrl : an url to the manga's first volume front cover.
 * Or 404 if there was an error with the request.
 */
// TODO: maybe this endpoint is not needed,
// since the cover url is supposed to be sent when gathering all manga's information.
router.get("/api/manga/:name/coverUrl", (req: any, res: any, next: any) => {
  let mangaName = req.params["name"];
  res.setHeader('Content-Type', 'application/json');
  McdIOSphe
    .getMangaCoverUrl(mangaName)
    .then((cover: MangaCover) => {
      res.status(200).send(JSON.stringify(cover, null, 2));
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

export const apiRouter = router;

// wikiPageID => can be interesting!