import * as express from "express";
import {externalUrl, staticRoot} from "./server.config";

export const mainRouter: any = express.Router();
// NOTE: the type 'any' fixes a bug between WebStorm and @Types

/**
 * The function to apply when someone queries an Angular's route.
 * Parameters are the basic ones given to an express apiRouter.
 */
function ngApp(req: any, res: any) {
  res.render("index", {
    req,
    res,
    preboot: false,
    baseUrl: "/",
    requestUrl: req.originalUrl,
    originUrl: externalUrl
  });
}

// Routes with html5pushstate
// Ensure routes match client-side-app
mainRouter.get("/", ngApp);
mainRouter.get("/about", ngApp);
mainRouter.get("/about/*", ngApp);
mainRouter.get("/home", ngApp);
mainRouter.get("/home/*", ngApp);
mainRouter.get("/search", ngApp);
mainRouter.get("/search/*", ngApp);

// Serve static files
mainRouter.use(express.static(staticRoot, {index: false}));

// Server a custom 404 page in case of an unknown route
mainRouter.get("*", (req: any, res: any) => {
  res.status(404).json({status: 404, message: "Resource not found"});
});

export default mainRouter;
