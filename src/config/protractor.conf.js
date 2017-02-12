var SpecReporter = require("jasmine-spec-reporter").SpecReporter;

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

    onPrepare: () => {
        require("ts-node").register({
            fast: true,
            disableWarnings: true
        });

        jasmine.getEnv().addReporter(new SpecReporter({
            displayStacktrace: true
        }));

        browser.ignoreSynchronization = false;
    },

    capabilities: {
        browserName: "chrome",
        chromeOptions: {
            args: ["--no-sandbox"]
        }
    },
    directConnect: true,
    useAllAngular2AppRoots: true
};