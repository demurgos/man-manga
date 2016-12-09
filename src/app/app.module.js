"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var home_module_1 = require("./home/home.module");
var about_module_1 = require("./about/about.module");
var search_module_1 = require("./search/search.module");
var response_module_1 = require("./response/response.module");
var app_routing_module_1 = require("./app-routing.module");
var app_component_1 = require("./app.component");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        declarations: [app_component_1.AppComponent],
        imports: [
            home_module_1.HomeModule,
            about_module_1.AboutModule,
            search_module_1.SearchModule,
            response_module_1.ResponseModule,
            app_routing_module_1.AppRoutingModule
        ],
        exports: [
            home_module_1.HomeModule,
            about_module_1.AboutModule,
            search_module_1.SearchModule,
            response_module_1.ResponseModule,
            app_routing_module_1.AppRoutingModule
        ]
    })
], AppModule);
exports.AppModule = AppModule;
