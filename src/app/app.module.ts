import {NgModule} from '@angular/core';

import {HomeModule} from './home/home.module';
import {AboutModule} from './about/about.module';
import {SearchModule} from './search/search.module';
import {ResponseModule} from "./response/response.module";
import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';
import {ApiService} from "./search/services/api.service";

@NgModule({
	declarations: [AppComponent],
  providers: [
    ApiService
  ],
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
