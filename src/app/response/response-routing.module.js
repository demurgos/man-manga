"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var anime_response_component_1 = require("./anime-response/anime-response.component");
var author_response_component_1 = require("./author-response/author-response.component");
var manga_response_component_1 = require("./manga-response/manga-response.component");
var ResponseRoutingModule = (function () {
    function ResponseRoutingModule() {
    }
    return ResponseRoutingModule;
}());
ResponseRoutingModule = __decorate([
    core_1.NgModule({
        imports: [
            router_1.RouterModule.forChild([
                { path: 'anime', component: anime_response_component_1.AnimeComponent },
                { path: 'author', component: author_response_component_1.AuthorComponent },
                { path: 'manga', component: manga_response_component_1.MangaComponent }
            ])
        ],
        exports: [
            router_1.RouterModule
        ]
    })
], ResponseRoutingModule);
exports.ResponseRoutingModule = ResponseRoutingModule;
