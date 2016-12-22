import * as childProcess from "child_process";
import * as portFinder from "portfinder";
import * as path from "path";
import { logger } from "./logger";
import * as opn from "opn";
import { merge } from "lodash";

export function getCurrentCommit(): string {
    return JSON.stringify(childProcess
        .execSync("git rev-parse HEAD")
        .toString().trim());
}

export function getAvailablePort(): Promise<number> {
    return new Promise((resolve, reject) => {
        portFinder.getPort((error: any, port: number) => {
            if (error !== null) {
                return reject(error);
            } else {
                resolve(port);
            }
        });
    });
}

export function openBrowser(host: string, port: number, baseHref: string) {
    opn(`http://${host}:${port}${baseHref}`);
}

export function getEnvironment(rootDir: string): EnvironmentVariables {
    const environment: Environment = process.env.NODE_ENV || "development";

    const pkg = getPackage(rootDir);
    const version = JSON.stringify(pkg["version"] || "unknown");
    const commit = getCurrentCommit();
    const buildDate = JSON.stringify(new Date());

    return Object.assign({}, pkg[environment], { version, commit, buildDate, current: JSON.stringify(environment) });
}

export function getIm2mConfig(rootDir: string): IM2MConfig {
    let config: IM2MConfig = {
        rootDir: rootDir,
        sourceDir: "src",
        targetDir: "www",
        coverageDir: "coverage",
        e2eDir: "e2e",
        dllDir: "dll",
        baseHref: "/",
        angular: {
            aotTsConfig: "tsconfig.json",
            appModule: "app/app.module#AppModule"
        },
        typescript: {
            entry: "bootstrap.ts",
            output: "app.js"
        }
    };
    try {
        const im2mConfig = require(path.join(rootDir, "im2m.config.ts"));
        config = merge(config, im2mConfig);
        logger.debug("im2m.config.ts:\n" + JSON.stringify(config, null, 2));
    } catch (error) {
        logger.debug("Did not find a im2m.config.ts file in the current directory.");
    }
    return normalizeConfig(config);
}

function normalizeConfig(config: IM2MConfig): IM2MConfig {
    config.sourceDir = path.join(config.rootDir, config.sourceDir);
    config.targetDir = path.join(config.rootDir, config.targetDir);
    config.dllDir = path.join(config.rootDir, config.dllDir);
    config.coverageDir = path.join(config.rootDir, config.coverageDir);
    config.typescript.entry = path.join(config.sourceDir, config.typescript.entry);
    return config;
}

export function getPackage(rootDir: string) {
    let pkg;
    try {
        pkg = require(path.join(rootDir, "package.json"));
    } catch (error) {
        console.error(error);
        pkg = {};
    }
    return pkg;
}
