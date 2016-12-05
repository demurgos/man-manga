import {NgModule} from '@angular/core';

import {SearchBarComponent} from './search-bar/search-bar.component';
import {SearchRoutingModule} from "./search-routing.module";

@NgModule({
  imports: [
    SearchRoutingModule
  ],
  declarations: [
    SearchBarComponent
  ],
  exports: [
    SearchBarComponent
  ]
})
export class SearchModule {}
