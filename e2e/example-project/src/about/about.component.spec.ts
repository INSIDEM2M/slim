import { AboutComponent } from "./about.component";

describe("About", () => {

    it("True should equal true", () => {
        const c = new AboutComponent();
        expect(c).not.toBe(null);
    });

    it("True should not equal false", () => {
        expect(true).not.toEqual(false);
    });
});