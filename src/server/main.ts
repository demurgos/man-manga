// The polyfills must be one of the first things imported in node.js.
// The only modules to be imported higher - node modules with es6-promise 3.x or other Promise polyfill dependency
// (rule of thumb: do it if you have zone.js exception that it has been overwritten)
import "angular2-universal-polyfills";

import {ResourceLoader} from "@angular/compiler";
import {enableProdMode} from "@angular/core";
import {createEngine} from "angular2-express-engine";
import {NodePlatform} from "angular2-platform-node";
import {platformNodeDynamic} from "angular2-universal/node";
import * as bodyParser from "body-parser";
import cookieParser = require("cookie-parser");
import express = require("express");
import {Server} from "http";
import morgan = require("morgan");
import {AppServerModule} from "./app.server.module";
import {FileSystemResourceLoader} from "./node-polyfill";
import apiRouter from "./routes/server.api-router";
import mainRouter from "./routes/server.main-router";
import {serverPort, staticRoot} from "./server.config";

// Enable Angular's prod for faster renders
enableProdMode();

// Create the server's app
const app: any = express();

// Create the express engine for the Angular app
app.engine(".html", createEngine({
  // Fix server-side resource-loading, see ./node-polyfill.ts
  // See https://github.com/angular/universal/issues/579
  platform: (extraProviders: any) => {
    const platform: NodePlatform = platformNodeDynamic(extraProviders);
    (<any> platform).cacheModuleFactory_old = platform.cacheModuleFactory;

    platform.cacheModuleFactory = (moduleType: any, compilerOptions?: any): Promise<any> => {
      if (!compilerOptions) {
        compilerOptions = {
          providers: [
            {provide: ResourceLoader, useClass: FileSystemResourceLoader}
          ]
        };
      }
      return (<any> platform).cacheModuleFactory_old(moduleType, compilerOptions);
    };
    return platform;
  },
  precompile: true,
  ngModule: AppServerModule
}));

// Set app variables
app.set("views", staticRoot);
app.set("view engine", "html");

// Log the requests
app.use(morgan("dev"));

// Configure the server to parse body
app.use(cookieParser("ManManGa awesome app!"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Configure routes
// NOTE: globalRouter must be the last used, since it defines defaults routes
app.use(apiRouter);
app.use(mainRouter);

// Instantiate the server
const server: Server = app.listen(process.env.PORT || serverPort, () => {
  console.log(`Listening on: http://localhost:${server.address().port}`);
});
