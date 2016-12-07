import {Router} from 'express';

const router: Router = Router();

router.get("/api/test", (req, res, next) => {
	res.setHeader('Content-Type', 'application/json');
	res.status(200).send(JSON.stringify({"api-call": "You got it!"}, null, 2));
});

export const apiRouter = router;