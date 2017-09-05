var SpecReporter = require("jasmine-spec-reporter").SpecReporter;
var jasmineReporters = require("jasmine-reporters");
var HtmlScreenshotReporter = require("protractor-jasmine2-screenshot-reporter");
var fs = require("fs");
var path = require("path");

var reporter = new HtmlScreenshotReporter({
    dest: "test-reports/e2e",
    filename: "index.html",
    cleanDestination: true,
    showQuickLinks: true
});

exports.config = {
    exclude: [],

    framework: "jasmine",

    allScriptsTimeout: 11000,

    jasmineNodeOpts: {
        showTiming: true,
        showColors: true,
        isVerbose: false,
        defaultTimeoutInterval: 30000,
        includeStackTrace: false
    },

    beforeLaunch: function() {
        return new Promise(function(resolve) {
            reporter.beforeLaunch(resolve);
        });
    },

    onPrepare: () => {
        require("ts-node").register({
            fast: true,
            disableWarnings: true
        });

        jasmine.getEnv().addReporter(
            new SpecReporter({
                displayStacktrace: true
            })
        );

        jasmine.getEnv().addReporter(
            new jasmineReporters.JUnitXmlReporter({
                consolidateAll: true,
                savePath: path.join("test-reports", "e2e"),
                filePrefix: "e2e-test-results"
            })
        );

        jasmine.getEnv().addReporter(reporter);

        browser.ignoreSynchronization = false;
    },

    afterLaunch: function(exitCode) {
        return new Promise(function(resolve) {
            reporter.afterLaunch(resolve.bind(this, exitCode));
        });
    },

    capabilities: {
        browserName: "chrome",
        chromeOptions: {
            args: ["--headless", "--disable-gpu", "--window-size=1024,768"]
        }
    },
    directConnect: true,
    useAllAngular2AppRoots: true
};
