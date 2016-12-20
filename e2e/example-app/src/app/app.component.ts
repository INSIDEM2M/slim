import { Component } from "@angular/core";

@Component({
    selector: "im2m-app",
    templateUrl: "./app.template.html",
    styleUrls: ["./app.style.scss"]
})
export class AppComponent {

    commit: string = environment.commit;
    buildDate: Date = environment.buildDate;
}