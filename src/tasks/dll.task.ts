import * as path from "path";
import * as webpack from "webpack";
import * as webpackMerge from "webpack-merge";

import { getCommonConfigPartial } from "../webpack/webpack.config.common";
import { getDllConfigPartial } from "../webpack/webpack.config.dll";
import * as fs from "fs";
import { VENDORS } from "../webpack/webpack.vendors";
import { POLYFILLS } from "../webpack/webpack.polyfills";
import { logger, timer } from "../logger";

const DLL_CACHE_FILE_NAME = "dll.cache.json";

module.exports = function (env: EnvironmentVariables, config: SlimConfig, forceUpdate: boolean) {
    const pkg = JSON.parse(fs.readFileSync(path.join(config.rootDir, "package.json"), "utf-8"));
    const dllDependencies = getDllDependencies(config);
    if (forceUpdate) {
        logger.debug("Forced DLL cache update.");
        return updateDlls(env, config, dllDependencies, pkg);
    } else {
        if (dllsUpToDate(config.dllDir, DLL_CACHE_FILE_NAME, pkg, dllDependencies)) {
            logger.info("Found up-to-date DLL cache.");
            return Promise.resolve(0);
        } else {
            return updateDlls(env, config, dllDependencies, pkg);
        }
    }
};

function updateDlls(env: EnvironmentVariables, config: SlimConfig, dllDependencies: string[], pkg: any) {
    logger.info("Updating DLL cache...");
    timer.start("DLL cache update");
    writeDllCache(config.dllDir, DLL_CACHE_FILE_NAME, dllDependencies, pkg);
    timer.end("DLL cache update");
    const indexPath = path.join(config.sourceDir, "index.html");
    const commonConfig = getCommonConfigPartial(indexPath, env, config);
    const buildConfig = getDllConfigPartial(path.join(config.dllDir));
    const webpackConfig = (webpackMerge as any).strategy({
        "entry": "replace"
    })(commonConfig, buildConfig);
    return runBuild(webpackConfig);
}

function runBuild(config: webpack.Configuration) {
    logger.info("Creating DLL files and manifests...");
    timer.start("DLL bundle creation");
    return new Promise((resolve, reject) => {
        webpack(config, (error, stats) => {
            if (stats.hasErrors()) {
                return reject(stats.toJson().errors[0]);
            }
            timer.end("DLL bundle creation");
            resolve(0);
        });
    });
}

export function getDllDependencies(config: SlimConfig): string[] {
    const additionalVendors = config.typescript && Array.isArray(config.typescript.vendors) ? config.typescript.vendors : [];
    return VENDORS.concat(POLYFILLS).concat(additionalVendors).map(vendor => {
        // This is needed to compare vendors with deep import paths like
        // zone.js/dist/long-stack-trace-zone.js. In this case we have to check whether
        // the version of zone.js has changed.
        if (vendor.includes("/")) {
            // Scoped npm packages contain a '/' in their name that we have to preserve
            if (vendor.startsWith("@")) {
                return vendor.split("/")[0] + "/" + vendor.split("/")[1];
            } else {
                return vendor.split("/")[0];
            }
        } else {
            return vendor;
        }
    });
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