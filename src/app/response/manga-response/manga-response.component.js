"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var MANGATEST = {
    title: 'Death Note',
    author: { name: 'Tsugumi Oba' },
    illustrator: 'Takeshi Obata'
};
var MangaComponent = (function () {
    function MangaComponent() {
        // this.manga = MANGATEST; // 1/2 won't work
    }
    MangaComponent.prototype.ngOnInit = function () {
        var _this = this;
        console.log("Manga !");
        this.manga = MANGATEST;
        setTimeout(function () {
            _this.manga.title = "Truc de merde";
            console.log("done");
        }, 10000);
    };
    return MangaComponent;
}());
MangaComponent = __decorate([
    core_1.Component({
        selector: "mmg-manga-response",
        moduleId: "response/manga-response/manga-response.component",
        templateUrl: "manga-response.component.html",
        styleUrls: ["manga-response.component.css"]
    })
], MangaComponent);
exports.MangaComponent = MangaComponent;
