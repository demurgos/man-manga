import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
// for AoT we need to manually split universal packages
import {UniversalModule} from "angular2-universal/browser";

import {AppRoutingModule} from "../app/app-routing.module";
import {AppComponent} from "../app/app.component";
import {AppModule} from "../app/app.module";
import * as tokens from "../app/app.tokens";
import * as clientTokens from "./app.client.token-values";

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    // BrowserModule, HttpModule, and JsonpModule are included
    UniversalModule,
    FormsModule,

    AppModule,
    AppRoutingModule
  ],
  providers: [
    {provide: tokens.appEnvironment, useValue: clientTokens.environment},
    {provide: tokens.appConfig, useValue: clientTokens.config}
  ]
})
export class AppClientModule {
}
