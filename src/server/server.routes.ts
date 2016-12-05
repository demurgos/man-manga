import * as express from 'express';
import * as path from 'path';
import {ROOT, SERVER_URL} from './server.config';

const router: any = express.Router();
// NOTE: the type 'any' fixes a bug between WebStorm and @Types

/**
 * The function to apply when someone queries an Angular's route.
 * Parameters are the basic ones given to an express router.
 */
function ngApp(req: any, res: any) {
	res.render('index', {
		req,
		res,
		preboot: false,
		baseUrl: '/',
		requestUrl: req.originalUrl,
		originUrl: SERVER_URL
	});
}

// Routes with html5pushstate
// Ensure routes match client-side-app
router.get('/', ngApp);
router.get('/about', ngApp);
router.get('/about/*', ngApp);
router.get('/home', ngApp);
router.get('/home/*', ngApp);
router.get('/search', ngApp);
router.get('/search/*', ngApp);

// Serve static files
router.use(express.static(path.join(ROOT, 'build/client'), {index: false}));

// Server a custom 404 page in case of an unknown route
router.get('*', (req: any, res: any) => {
	res.setHeader('Content-Type', 'application/json');
	const pojo = {status: 404, message: 'No Content'};
	const json = JSON.stringify(pojo, null, 2);
	res.status(404).send(json);
});

export const globalRouter = router;