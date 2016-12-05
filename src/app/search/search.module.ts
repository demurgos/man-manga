import {NgModule} from '@angular/core';

import {SearchComponent} from './search-bar/search-bar.component';
import {SearchRoutingModule} from "./search-routing.module";

@NgModule({
  imports: [
    SearchRoutingModule
  ],
  declarations: [
    SearchComponent
  ],
  exports: [
    SearchComponent
  ]
})
export class SearchModule {}
