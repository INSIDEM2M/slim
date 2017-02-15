import * as childProcess from "child_process";
import * as portFinder from "portfinder";
import * as path from "path";
import { logger } from "./utils";
import * as opn from "opn";
import { merge } from "lodash";
import { SlimConfig, defaultSlimConfig } from "./config/slim-typings";
import * as fs from "fs";
import { argv } from "yargs";
import * as webpack from "webpack";

function getCurrentCommit(): string {
    if (fs.existsSync(path.join(process.cwd(), ".git"))) {
        return childProcess
            .execSync("git rev-parse HEAD")
            .toString().trim();
    } else {
        return "";
    }
}

let randomPort;
export function getAvailablePort(): Promise<number> {
    if (randomPort) {
        return Promise.resolve(randomPort);
    } else {
        if (argv["ci"]) {
            randomPort = 2048 + Math.round(Math.random() * 60000);
            return Promise.resolve(randomPort);
        } else {
            return portFinder.getPortPromise();
        }
    }
}

export function openBrowser(host: string, port: number, baseHref: string = "/") {
    return opn(`http://${host}:${port}${baseHref}`);
}

export function getEnvironment(rootDir: string): Environment {
    const environment = process.env.NODE_ENV || "development";

    const pkg = getPackage(rootDir);
    const version = JSON.stringify(pkg["version"] || "unknown");
    const commit = JSON.stringify(getCurrentCommit());
    const buildDate = JSON.stringify(new Date());

    const properties = pkg["buildProperties"] ? pkg.buildProperties[argv["env"] ? argv["env"] : environment] : {};

    Object.keys(properties).forEach(prop => properties[prop] = JSON.stringify(properties[prop]));

    return Object.assign({}, properties, { version, commit, buildDate, current: JSON.stringify(environment) });
}

export function getSlimConfig(rootDir: string): SlimConfig {
    let config = defaultSlimConfig;
    const slimConfigPath = path.join(rootDir, "slim.config.ts");
    if (fs.existsSync(slimConfigPath)) {
        const projectSlimConfig = require(slimConfigPath);
        config = merge(config, projectSlimConfig);
    } else {
        logger.debug("Did not find a slim.config.ts file in the current directory.");
    }
    logger.debug("slim.config.ts:\n" + JSON.stringify(config, null, 2));
    return normalizeConfig(config);
}

export function prettyPrintConfig(webpackConfig: webpack.Configuration): string {
    const replacerFn = (key: string, value: any) => {
        // Filter webpack.DllReferencePlugin manifest entries
        if (value && value["options"] !== undefined && value["options"]["context"] !== undefined) {
            return undefined;
        }
        return value;
    };
    return JSON.stringify(webpackConfig, replacerFn, 2);
}

function normalizeConfig(config: SlimConfig): SlimConfig {
    config.sourceDir = path.join(config.rootDir, config.sourceDir);
    config.targetDir = path.join(config.rootDir, config.targetDir);
    config.dllDir = path.join(config.rootDir, config.dllDir);
    config.coverageDir = path.join(config.rootDir, config.coverageDir);
    config.typescript.entry = path.join(config.sourceDir, config.typescript.entry);
    config.angular.aotTsConfig = path.join(config.rootDir, config.angular.aotTsConfig);
    config.angular.appModule = path.join(config.rootDir, config.angular.appModule);
    config.sass.includePaths.push(config.sourceDir);
    config.sass.globalStyles = config.sass.globalStyles.map(style => path.isAbsolute(style) ? style : path.join(config.rootDir, style));
    for (let asset of config.assets.entries) {
        if (!path.isAbsolute(asset.from)) {
            asset.from = path.join(config.rootDir, asset.from);
        }
    }
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
