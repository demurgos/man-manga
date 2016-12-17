// Fix Material Support
import {__platform_browser_private__} from "@angular/platform-browser";
function universalMaterialSupports(this: any, eventName: string): boolean {
  return Boolean(this.isCustomEvent(eventName));
}
__platform_browser_private__.HammerGesturesPlugin.prototype.supports = universalMaterialSupports;
// End Fix Material Support

import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
// for AoT we need to manually split universal packages
import {isBrowser, isNode, UniversalModule} from "angular2-universal/node";
import {AppRoutingModule} from "../app/app-routing.module";
import {AppComponent} from "../app/app.component";
import {AppModule} from "../app/app.module";

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    UniversalModule, // NodeModule, NodeHttpModule, and NodeJsonpModule are included
    FormsModule,

    AppModule,
    AppRoutingModule
  ],
  providers: [
    {provide: "isBrowser", useValue: isBrowser},
    {provide: "isNode", useValue: isNode}
  ]
})
export class AppServerModule {
  constructor() {
    console.log("Serve");
  }
}
