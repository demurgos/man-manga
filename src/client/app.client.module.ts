import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
// for AoT we need to manually split universal packages
import {isBrowser, isNode, UniversalModule} from "angular2-universal/browser";

import {AppRoutingModule} from "../app/app-routing.module";
import {AppComponent} from "../app/app.component";
import {AppModule} from "../app/app.module";

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    UniversalModule, // BrowserModule, HttpModule, and JsonpModule are included
    FormsModule,

    AppModule,
    AppRoutingModule
  ],
  providers: [
    {provide: "isBrowser", useValue: isBrowser},
    {provide: "isNode", useValue: isNode}
  ]
})
export class AppClientModule {
  constructor() {
    console.log("Generating AppClientModule");
  }
}
