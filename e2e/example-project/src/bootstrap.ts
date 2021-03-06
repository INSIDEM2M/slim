import "./shims";

import { Component, NgModule, enableProdMode, ApplicationRef } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { BrowserModule, enableDebugTools } from "@angular/platform-browser";
import { AppModule } from "./app/app.module";
import { bootloader } from "@angularclass/hmr";

if (environment.current === "production") {
    enableProdMode();
}

console.log(environment);

export function main() {
    return platformBrowserDynamic().bootstrapModule(AppModule)
        .catch(err => console.error(err));
}

bootloader(main);