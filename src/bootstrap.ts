import "./shims";

import { Component, NgModule, enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { BrowserModule } from "@angular/platform-browser";
import { AppModule } from "./app/app.module";

if (environment.current === "production") {
    enableProdMode();
}

console.log(environment);

platformBrowserDynamic().bootstrapModule(AppModule);
