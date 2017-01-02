import {isBrowser, isNode} from "angular2-universal/browser";
import {Config, Environment} from "../app/app.tokens";

export const environment: Environment = {
  isBrowser,
  isNode
};

const apiBaseUri: string = "http://localhost:3000/api";

export const config: Config = {
  apiBaseUri
};
