// Fix Material Support
import {__platform_browser_private__} from '@angular/platform-browser';
function universalMaterialSupports(this: any, eventName: string): boolean {
  return Boolean(this.isCustomEvent(eventName));
}
__platform_browser_private__.HammerGesturesPlugin.prototype.supports = universalMaterialSupports;
// End Fix Material Support

import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {UniversalModule, isBrowser, isNode} from 'angular2-universal/node'; // for AoT we need to manually split universal packages

import {HomeModule} from '../app/home/home.module';
import {AboutModule} from '../app/about/about.module';
import {SearchModule} from "../app/search/search.module";
import {AppComponent} from '../app/app.component';
import {AppRoutingModule} from '../app/app-routing.module';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent],
  imports: [
    UniversalModule, // NodeModule, NodeHttpModule, and NodeJsonpModule are included
    FormsModule,

    HomeModule,
    AboutModule,
    SearchModule,

    AppRoutingModule
  ],
  providers: [
    {provide: 'isBrowser', useValue: isBrowser},
    {provide: 'isNode', useValue: isNode}
  ]
})
export class AppServerModule {
  constructor() {
    console.log("Serve");
  }

  // we need to use the arrow function here to bind the context as this is a gotcha in Universal for now until it's fixed
  universalDoDehydrate = (universalCache: any) => {
    // universalCache['Cache'] = JSON.stringify(this.cache.dehydrate());
  };
  universalAfterDehydrate = () => {
    // this.cache.clear();
  };
}
