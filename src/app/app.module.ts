import {NgModule} from '@angular/core';

import {HomeModule} from './home/home.module';
import {AboutModule} from './about/about.module';
import {SearchModule} from './search/search.module';

@NgModule({
	imports: [
		HomeModule,
		AboutModule,
		SearchModule
	],
	exports: [
		HomeModule,
		AboutModule,
		SearchModule
	]
})
export class AppModule {
}