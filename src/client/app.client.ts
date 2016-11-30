import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UniversalModule, isBrowser, isNode } from 'angular2-universal/browser'; // for AoT we need to manually split universal packages

import { HomeModule } from '../app/home/home.module';
import { AboutModule } from '../app/about/about.module';
import { AppComponent } from '../app/app.component';
import { AppRoutingModule } from '../app/app-routing';
// import { Cache } from '../app/universal-cache';

@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [ AppComponent ],
  imports: [
    UniversalModule, // BrowserModule, HttpModule, and JsonpModule are included
    FormsModule,

    HomeModule,
    AboutModule,

    AppRoutingModule
  ],
  providers: [
    { provide: 'isBrowser', useValue: isBrowser },
    { provide: 'isNode', useValue: isNode }
    // Cache
  ]

})
export class MainModule {
  constructor() {
    console.log("Generating MainModule")
  }
}
