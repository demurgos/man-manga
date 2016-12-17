// the polyfills must be the first thing imported
import "angular2-universal-polyfills";

// Angular 2
import {enableProdMode, PlatformRef} from "@angular/core";
import {platformUniversalDynamic} from "angular2-universal";
import {AppClientModule} from "./app.client.module";

// enable prod for faster renders
enableProdMode();

const platformRef: PlatformRef = platformUniversalDynamic();

// on document ready bootstrap Angular 2
document.addEventListener("DOMContentLoaded", () => {
  platformRef.bootstrapModule(AppClientModule);
});
