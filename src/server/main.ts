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
import * as cookieParser from "cookie-parser";
import * as express from "express";
import {IRouter, IRouterHandler} from "express-serve-static-core";
import {AppServerModule} from "./app.server.module";
import {FileSystemResourceLoader} from "./node-polyfill";
import apiRouter from "./server.api";
import {staticRoot} from "./server.config";
import mainRouter from "./server.routes";

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

// Configure the server to parse body
(<IRouterHandler<IRouter>> app.use)(cookieParser("ManManGa awesome app!"));
(<IRouterHandler<IRouter>> app.use)(bodyParser.urlencoded({extended: true}));
(<IRouterHandler<IRouter>> app.use)(bodyParser.json());

// Configure routes
// NOTE: globalRouter must be the last used, since it defines defaults routes
(<IRouterHandler<IRouter>> app.use)(apiRouter);
(<IRouterHandler<IRouter>> app.use)(mainRouter);

// Instantiate the server
const server: any = app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on: http://localhost:${server.address().port}`);
});
