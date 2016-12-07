import {NgModule} from '@angular/core';

import {HomeModule} from './home/home.module';
import {AboutModule} from './about/about.module';
import {SearchModule} from './search/search.module';
import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';

@NgModule({
	declarations: [AppComponent],
	imports: [
		HomeModule,
		AboutModule,
		SearchModule,
		AppRoutingModule
	],
	exports: [
		HomeModule,
		AboutModule,
		SearchModule,
		AppRoutingModule
	]
})
export class AppModule {
}