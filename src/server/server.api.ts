import {Router} from 'express';

const router: Router = Router();

router.get("/api/test", (req, res, next) => {
	res.status(200).send("You got it!");
});

export const apiRouter = router;