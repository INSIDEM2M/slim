import * as process from "process";
import { SlimConfig } from "./slim-config";

export const defaultSlimConfig: SlimConfig = {
    rootDir: process.cwd(),
    dllDir: "dll",
    sourceDir: "src",
    targetDir: "www",
    coverageDir: "coverage",
    e2eDir: "e2e",
    angular: {
        appModule: "./src/app/app.module#AppModule",
        aotTsConfig: "./tsconfig.json"
    },
    typescript: {
        entry: "bootstrap.ts",
        output: "app.js",
        typecheck: false
    },
    sass: {
        outputStyle: "compressed",
        precision: 7,
        importsIgnoredDuringTesting: ["scss/variables"],
        includePaths: [],
        globalStyles: []
    },
    assets: {
        entries: []
    },
    webpack: {
        ignoreSourceMaps: [
            /ionic-angular/,
            /ionic-native/
        ],
        ignoreScripts: []
    }
};