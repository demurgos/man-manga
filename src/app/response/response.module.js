"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var anime_response_component_1 = require("./anime-response/anime-response.component");
var author_response_component_1 = require("./author-response/author-response.component");
var manga_response_component_1 = require("./manga-response/manga-response.component");
var response_routing_module_1 = require("./response-routing.module");
var ResponseModule = (function () {
    function ResponseModule() {
    }
    return ResponseModule;
}());
ResponseModule = __decorate([
    core_1.NgModule({
        imports: [
            response_routing_module_1.ResponseRoutingModule
        ],
        declarations: [
            anime_response_component_1.AnimeComponent,
            author_response_component_1.AuthorComponent,
            manga_response_component_1.MangaComponent
        ],
        exports: [
            anime_response_component_1.AnimeComponent,
            author_response_component_1.AuthorComponent,
            manga_response_component_1.MangaComponent
        ]
    })
], ResponseModule);
exports.ResponseModule = ResponseModule;
