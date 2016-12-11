import { Component } from "@angular/core";

@Component({
    selector: "im2m-about",
    templateUrl: "./about.template.html",
    styleUrls: ["./about.style.scss"]
})
export class AboutComponent {

    test: number;

    constructor() {
        console.log("About");
    }

    someMethod() {
        console.log("Great");
    }
}