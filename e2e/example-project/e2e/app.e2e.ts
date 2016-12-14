describe("App", () => {
    it("Should have the right title", () => {
        browser.driver.get("http://localhost:8000");
        expect(browser.getTitle()).toEqual("Angular 3 App");
    });
});