import * as path from "path";
import { argv } from "yargs";

export function getKarmaConfig(testFile: string, polyfills: string, vendors: string, port: number, watch: boolean, coverage: boolean, coverageDir: string) {
    const config = {
        basePath: "",
        frameworks: ["jasmine"],
        exclude: [],
        preprocessors: {},
        files: [{
            pattern: polyfills,
            included: true,
            watched: false
        }, {
            pattern: vendors,
            included: true,
            watched: false
        }, {
            pattern: testFile,
            watched: watch
        }],
        coverageReporter: {
            type: "in-memory"
        },
        remapCoverageReporter: {
            "text-summary": null,
            json: path.join(coverageDir, "coverage.json"),
            html: path.join(coverageDir, "html")
        },
        reporters: [
            "mocha"
        ],
        port: port,
        colors: true,
        autoWatch: watch,
        browsers: [
            "Chrome"
        ],
        singleRun: !watch
    }
    config.preprocessors[testFile] = [
        "sourcemap"
    ];
    if (coverage) {
        config.preprocessors[testFile].unshift("coverage");
        config.reporters.push("coverage", "remap-coverage");
    }
    return config;
}