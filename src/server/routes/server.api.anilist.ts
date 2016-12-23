import {Router}     from 'express';
import {AnilistApi} from '../lib/anilist-api.class';
import {Character}  from '../../lib/interfaces/character.interface';
import {Anilist}    from "../lib/anilist-api.interfaces";

const router: Router = Router();

/**
 * The object managing Anilist's API calls.
 */
const anilistAPI = new AnilistApi();  // TODO: what about multiple queries at the same time with an expired token ?

/**
 * GET /character/:name
 *    :name The character's name.
 * Gather all available information about the character ':name',
 * according to anilist.
 * Meant to research a character with a precise name.
 */
router.get("/character/:name", (req: any, res: any) => {
  let characterName: string = req.params["name"];
  res.setHeader('Content-Type', 'application/json');
  anilistAPI
    .getCharacter(characterName)
    .then((character: Character) => {
      res.status(200).send(JSON.stringify(character, null, 2));
    });
});

/**
 * GET /search/manga/:keywords
 *    :keywords The keywords with which searching for mangas.
 * Gather the list of all mangas with a title matching the given keywords,
 * according to anilist.
 */
router.get("/search/manga/:keywords", (req: any, res: any) => {
  res.setHeader('Content-Type', 'application/json');
  anilistAPI
    .searchManga(req.params["keywords"])
    .then((result: Anilist.Manga) => {
      res.status(200).send(JSON.stringify(result, null, 2));
    })
    .catch((err: Error) => {
      res.status(404).send(err);
    });
});

/**
 * GET /search/anime/:keywords
 *    :keywords The keywords with which searching for animes.
 * Gather the list of all animes with a title matching the given keywords,
 * according to anilist.
 */
router.get("/search/anime/:keywords", (req: any, res: any) => {
  res.setHeader('Content-Type', 'application/json');
  anilistAPI
    .searchAnime(req.params["keywords"])
    .then((result: Anilist.Anime) => {
      res.status(200).send(JSON.stringify(result, null, 2));
    })
    .catch((err: Error) => {
      console.log(err);
      res.status(404).send(err);
    });
});

/**
 * GET /search/character/:keywords
 *    :keywords The keywords with which searching for characters.
 * Gather the list of all characters with a name matching the given keywords,
 * according to anilist.
 */
router.get("/search/character/:keywords", (req: any, res: any) => {
  res.setHeader('Content-Type', 'application/json');
  anilistAPI
    .searchCharacter(req.params["keywords"])
    .then((result: Character[]) => {
      res.status(200).send(JSON.stringify(result, null, 2));
    })
    .catch((err: Error) => {
      console.log(err);
      res.status(404).send(err);
    });
});

/**
 * GET /search/staff/:keywords
 *    :keywords The keywords with which searching for staff members.
 * Gather the list of all staff members with a name matching the given keywords,
 * according to anilist.
 */
router.get("/search/staff/:keywords", (req: any, res: any) => {
  res.setHeader('Content-Type', 'application/json');
  anilistAPI
    .searchStaff(req.params["keywords"])
    .then((result: Anilist.Staff) => {
      res.status(200).send(JSON.stringify(result, null, 2));
    })
    .catch((err: Error) => {
      console.log(err);
      res.status(404).send(err);
    });
});

/**
 * GET /search/studio/:keywords
 *    :keywords The keywords with which searching for studios.
 * Gather the list of all studios with a name matching the given keywords,
 * according to anilist.
 */
router.get("/search/studio/:keywords", (req: any, res: any) => {
  res.setHeader('Content-Type', 'application/json');
  anilistAPI
    .searchStudio(req.params["keywords"])
    .then((result: Anilist.Studio) => {
      res.status(200).send(JSON.stringify(result, null, 2));
    })
    .catch((err: Error) => {
      console.log(err);
      res.status(404).send(err);
    });
});

export const anilistApiRouter = router;
