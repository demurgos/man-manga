// the polyfills must be one of the first things imported in node.js.
// The only modules to be imported higher - node modules with es6-promise 3.x or other Promise polyfill dependency
// (rule of thumb: do it if you have zone.js exception that it has been overwritten)
import 'angular2-universal-polyfills';

import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import {IRouterHandler, IRouterMatcher, IRouter} from "express-serve-static-core";

// Angular 2
import {enableProdMode} from '@angular/core';
// Angular 2 Universal
import {FileSystemResourceLoader} from './node-polyfill';
import {ResourceLoader} from '@angular/compiler';
import {platformNodeDynamic} from 'angular2-universal/node';
import {createEngine} from 'angular2-express-engine';

// App
import {AppServerModule} from './app.server.module';

// enable prod for faster renders
enableProdMode();

const app = express();
const ROOT = path.join(path.resolve(__dirname, '../../..'));

// Express View
app.engine('.html', createEngine({
  // Fix server-side resource-loading, see ./node-polyfill.ts
  // See https://github.com/angular/universal/issues/579
  platform: (extraProviders: any) => {
    const platform = platformNodeDynamic(extraProviders);
    (<any> platform).cacheModuleFactory_old = platform.cacheModuleFactory;

    platform.cacheModuleFactory = (moduleType: any, compilerOptions?: any): Promise<any> => {
      if(!compilerOptions) {
        compilerOptions = {
          providers: [
            {provide: ResourceLoader, useClass: FileSystemResourceLoader}
          ]
        }
      }
      return (<any> platform).cacheModuleFactory_old(moduleType, compilerOptions);
    };
    return platform;
  },
  precompile: true,
  ngModule: AppServerModule
}));
app.set('views', path.resolve(ROOT, "build/client"));
app.set('view engine', 'html');

(<IRouterHandler<IRouter>> app.use)(cookieParser('Angular 2 Universal'));
(<IRouterHandler<IRouter>> app.use)(bodyParser.json());

// Serve static files
(<IRouterHandler<IRouter>> app.use)(express.static(path.join(ROOT, 'build/client'), {index: false}));


import {serverApi} from './server.api';
// Our API for demos only
(<IRouterMatcher<IRouter>> app.get)('/data.json', serverApi);

function ngApp(req: any, res: any) {
  res.render('index', {
    req,
    res,
    preboot: false,
    baseUrl: '/',
    requestUrl: req.originalUrl,
    originUrl: 'http://localhost:3000'
  });
}
// Routes with html5pushstate
// ensure routes match client-side-app
(<IRouterMatcher<IRouter>> app.get)('/', ngApp);
(<IRouterMatcher<IRouter>> app.get)('/about', ngApp);
(<IRouterMatcher<IRouter>> app.get)('/about/*', ngApp);
(<IRouterMatcher<IRouter>> app.get)('/home', ngApp);
(<IRouterMatcher<IRouter>> app.get)('/home/*', ngApp);
(<IRouterMatcher<IRouter>> app.get)('/search', ngApp);
(<IRouterMatcher<IRouter>> app.get)('/search/*', ngApp);

(<IRouterMatcher<IRouter>> app.get)('*', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  const pojo = {status: 404, message: 'No Content'};
  const json = JSON.stringify(pojo, null, 2);
  res.status(404).send(json);
});

// Server
let server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on: http://localhost:${server.address().port}`);
});
