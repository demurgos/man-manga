import {OpaqueToken} from "@angular/core";

export interface Config {
  apiBaseUri: string;
}

export interface Environment {
  isNode: boolean;
  isBrowser: boolean;
}

export const appConfig: OpaqueToken = new OpaqueToken("app.config");
export const appEnvironment: OpaqueToken = new OpaqueToken("app.environment");
