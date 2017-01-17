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
        appModule: "app/app.module.ts",
        aotTsConfig: "tsconfig.json"
    },
    typescript: {
        entry: "bootstrap.ts",
        output: "app.js"
    },
    sass: {
        outputStyle: "compressed",
        precision: 7
    },
    images: {
        minify: {
            optimizationLevel: 7,
            progressive: true,
            interlaced: false,
        },
        flatten: false,
    },
    extras: {
        entries: []
    }
};