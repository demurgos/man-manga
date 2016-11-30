import { Component } from '@angular/core';

@Component({
  selector: 'mmg-app',
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
      </div>
    </div>
  `
})
export class AppComponent {

}
