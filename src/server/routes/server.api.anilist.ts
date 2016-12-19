import {Router}     from 'express';
import {AnilistApi} from '../lib/anilist-api.class';
import {Character}  from '../../lib/interfaces/character.interface';

const router: Router = Router();

/**
 * GET /api/character/:name
 *    :name The character's name.
 * Gather all available information about the character ':name',
 * according to anilist.
 * Meant to research a character with a precise name.
 */
const anilistAPI = new AnilistApi();  // TODO: what about multiple queries at the same time with an expired token ?
router.get("/character/:name", (req: any, res: any) => {
  let characterName: string = req.params["name"];
  anilistAPI
    .getCharacter(characterName)
    .then((character: Character) => {
      res.status(200).send(character);
    });
});

export const anilistApiRouter = router;
