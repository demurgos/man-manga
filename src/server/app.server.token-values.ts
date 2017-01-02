import {isBrowser, isNode} from "angular2-universal/node";
import * as url from "url";
import {Config, Environment} from "../app/app.tokens";
import {externalUrl} from "./server.config";

export const environment: Environment = {
  isBrowser,
  isNode
};

const apiBaseUri: string = url.resolve(externalUrl, "/api");

export const config: Config = {
  apiBaseUri
};
