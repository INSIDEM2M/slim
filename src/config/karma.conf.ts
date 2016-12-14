import * as path from "path";
import * as webpack from "webpack";
import * as karma from "karma";

import { argv } from "yargs";

export function getKarmaConfig(testFilePattern: string, vendorsPattern: string, polyfillsPattern: string, port: number, watch: boolean, coverage: boolean, coverageDir: string, webpackConfig: webpack.Configuration, browsers: string[], xmlReport: string): karma.ConfigOptions {
    const config: any = {
        basePath: "",
        frameworks: ["jasmine"],
        exclude: [],
        preprocessors: {},
        webpack: webpackConfig,
        webpackMiddleware: argv["debug"] ? {} : {
            stats: "errors-only",
            quiet: true
        },
        files: [
            {
                pattern: polyfillsPattern,
                watched: false
            },
            {
                pattern: vendorsPattern,
                watched: false
            },
            {
                pattern: testFilePattern,
                watched: false,
            }
        ],
        coverageReporter: {
            type: "in-memory"
        },
        remapCoverageReporter: {
            "text-summary": null,
            json: path.join(coverageDir, "coverage.json"),
            html: path.join(coverageDir, "html")
        },
        junitReporter: {
            outputFile: xmlReport,
        },
        reporters: [
            "mocha"
        ],
        port: port,
        colors: true,
        autoWatch: watch,
        browsers: browsers,
        singleRun: !watch
    }
    config.preprocessors[testFilePattern] = [
        "coverage",
        "webpack",
        "sourcemap"
    ];
    if (xmlReport) {
        config.reporters.push("junit");
    }
    if (coverage) {
        config.reporters.push("coverage", "remap-coverage");
    }
    return config;
}