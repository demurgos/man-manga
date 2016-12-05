import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {SearchComponent} from './search-bar/search-bar.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'search', component: SearchComponent}
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class SearchRoutingModule {}
