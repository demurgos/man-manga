import {NgModule} from "@angular/core";

import {AboutModule} from "./about/about.module";
import {AppRoutingModule} from "./app-routing.module";
import {HomeModule} from "./home/home.module";
import {ResponseModule} from "./response/response.module";
import {SearchModule} from "./search/search.module";

import {AppComponent} from "./app.component";

@NgModule({
  declarations: [AppComponent],
  imports: [
    HomeModule,
    AboutModule,
    SearchModule,
    ResponseModule,
    AppRoutingModule
  ],
  exports: [
    HomeModule,
    AboutModule,
    SearchModule,
    ResponseModule,
    AppRoutingModule
  ]
})
export class AppModule {
}
