// The polyfills must be one of the first things imported in node.js.
// The only modules to be imported higher - node modules with es6-promise 3.x or other Promise polyfill dependency
// (rule of thumb: do it if you have zone.js exception that it has been overwritten)
import 'angular2-universal-polyfills';

import * as path          from 'path';
import * as express       from 'express';
import * as bodyParser    from 'body-parser';
import * as cookieParser  from 'cookie-parser';
import {
	IRouterHandler,
	IRouter}                from "express-serve-static-core";
import {enableProdMode}   from '@angular/core';

// Angular 2 Universal
import {FileSystemResourceLoader} from './node-polyfill';
import {ResourceLoader}           from '@angular/compiler';
import {platformNodeDynamic}      from 'angular2-universal/node';
import {createEngine}             from 'angular2-express-engine';

// App
import {AppServerModule}  from './app.server.module';

// Server's routers
import {globalRouter}     from './server.routes';
import {apiRouter}        from './server.api';

// Server config
import {ROOT} from './server.config';

// Enable Angular's prod for faster renders
enableProdMode();

// Create the server's app
const app = express();

// Create the express engine for the Angular app
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

// Set app variables
app.set('views', path.resolve(ROOT, "build/client"));
app.set('view engine', 'html');

// Configure the server to parse body
(<IRouterHandler<IRouter>> app.use)(cookieParser('ManManGa awesome app!'));
(<IRouterHandler<IRouter>> app.use)(bodyParser.urlencoded({ extended: true }));
(<IRouterHandler<IRouter>> app.use)(bodyParser.json());

// Configure routes
// NOTE: globalRouter must be the last used, since it defines defaults routes
(<IRouterHandler<IRouter>> app.use)(apiRouter);
(<IRouterHandler<IRouter>> app.use)(globalRouter);

// Instantiate the server
let server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on: http://localhost:${server.address().port}`);
});
