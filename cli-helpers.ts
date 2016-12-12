import * as childProcess from "child_process";
import * as portFinder from "portfinder";
import * as path from "path";
import * as commandLineArgs from "command-line-args";
import * as commandLineUsage from "command-line-usage";
import * as commandLineCommands from "command-line-commands";
import * as chalk from "chalk";

import { commands } from "./cli-commands";
import { logger } from "./logger";
import * as opn from "opn";
import * as fs from "fs";
import { VENDORS } from "./webpack/webpack.vendors";
import { POLYFILLS } from "./webpack/webpack.polyfills";

export function parseBrowsers(browserOption: string): string[] {
    return typeof browserOption === "string" ? browserOption.split(",").map(option => option.charAt(0).toUpperCase().concat(option.substr(1))) : ["Chrome"];
}

export function getDllDependencies(config: IM2MConfig): string[] {
    const additionalVendors = config.typescript ? Array.isArray(config.typescript.vendors) ? config.typescript.vendors : [] : [];
    return VENDORS.concat(POLYFILLS).concat(additionalVendors);
}

export function dllsUpToDate(dllDir: string, dllCacheFile: string, pkg: any, dllDependencies: string[]): boolean {
    const dllCacheFilePath = path.join(dllDir, dllCacheFile);
    const dllCacheExists = fs.existsSync(dllCacheFilePath);
    if (!dllCacheExists) {
        return false;
    } else {
        const dllCacheFileContent = fs.readFileSync(dllCacheFilePath, "utf-8");
        try {
            const dllCache = JSON.parse(dllCacheFileContent);
            let result = true;
            for (let dep of dllDependencies) {
                result = result && (pkg.dependencies[dep] === dllCache.dependencies[dep]);
            }
            return result;
        } catch (error) {
            fs.unlinkSync(dllCacheFilePath);
            return false;
        }
    }
}

export function writeDllCache(dllDir: string, dllCacheFile: string, dllDependencies: string[], pkg: any) {
    const dllCachePath = path.join(dllDir, dllCacheFile);
    const dllCache = {
        dependencies: {}
    };
    for (let dep of dllDependencies) {
        dllCache.dependencies[dep] = pkg.dependencies[dep];
    }
    if (!fs.existsSync(dllDir)) {
        fs.mkdirSync(dllDir);
    }
    fs.writeFileSync(dllCachePath, JSON.stringify(dllCache, null, 2), { encoding: "utf-8" });
}

export function parseBrowsers(browserOption: string): string[] {
    return typeof browserOption === "string" ? browserOption.split(",").map(option => option.charAt(0).toUpperCase().concat(option.substr(1))) : ["Chrome"];
}

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
        config = Object.assign(config, require(path.join(rootDir, "im2m.config.ts")));
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
        pkg = {}
    }
    return pkg;
}

export function getCommand(): string {
    const { command } = commandLineCommands(commands.map(command => command.name).concat(null));
    return command;
}

export function getOptions(): Options {
    const { argv } = commandLineCommands(commands.map(command => command.name).concat(null));
    let optionDefinitions = [{ name: "debug" }, { name: "trace" }, { name: "config" }, { name: "cwd" }];

    commands.forEach(c => {
        optionDefinitions = optionDefinitions.concat(c.options || []);
    });

    return commandLineArgs(optionDefinitions, argv);
}

export function getCommandLineUsage(): string {
    const sections: CommandLineUsageSection[] = [
        {
            header: `${chalk.blue("Inside M2M CLI")}`,
            content: `$ ${chalk.bold("im2m")} <command> <options>`
        },
        {
            header: `${chalk.blue("Available commands")}`
        }
    ];
    commands.forEach(c => {
        sections.push({
            header: c.name,
            content: c.description,
            optionList: c.options
        });
    });
    return commandLineUsage(sections);
}