import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { AboutModule } from "../about/about.module";

@NgModule({
    imports: [BrowserModule, AboutModule],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule {

}