import {Component} from '@angular/core';
import {SearchComponent} from "./search/search-bar/search.component";

@Component({
  selector: 'mmg-app',
  moduleId: module.id,
  template: `
    <div class="wrapper">
      <div class="header">
        <h1>Web sémantique</h1>
      </div>
      <div class="content">
        <nav>
          <a routerLink="/home">Accueil</a>
          <a routerLink="/about">Infos</a>
        </nav>
        <router-outlet></router-outlet>
        <mmg-search></mmg-search>
      </div>
    </div>
  `
})
export class AppComponent {}
