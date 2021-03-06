import * as fs from "fs";
import * as path from "path";
import * as webpack from "webpack";
import * as webpackMerge from "webpack-merge";
import { SlimConfig } from "../config/slim-typings/slim-config";
import { logger, timer } from "../utils";
import { getCommonConfigPartial } from "../webpack/webpack.config.common";
import { getDllConfigPartial } from "../webpack/webpack.config.dll";
import { POLYFILLS } from "../webpack/webpack.polyfills";
import { VENDORS } from "../webpack/webpack.vendors";

const DLL_CACHE_FILE_NAME = "dll.cache.json";

module.exports = function(env: Environment, config: SlimConfig, forceUpdate: boolean) {
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

function updateDlls(env: Environment, config: SlimConfig, dllDependencies: string[], pkg: any) {
    logger.info("Updating DLL cache...");
    const indexPath = path.join(config.sourceDir, "index.html");
    const commonConfig = getCommonConfigPartial(indexPath, env, config, false, false);
    const buildConfig = getDllConfigPartial(path.join(config.dllDir));
    const webpackConfig = (webpackMerge as any).strategy({
        entry: "replace"
    })(commonConfig, buildConfig);
    return runBuild(webpackConfig).then(exitCode => {
        if (exitCode === 0) {
            writeDllCache(config.dllDir, DLL_CACHE_FILE_NAME, dllDependencies, pkg);
        }
    });
}

function runBuild(config: webpack.Configuration) {
    logger.info("Creating DLL files and manifests...");
    timer.start("DLL bundle creation");
    return new Promise((resolve, reject) => {
        webpack(config, (error, stats) => {
            if (error) {
                logger.error(error);
            }
            if (stats.hasErrors()) {
                logger.error(stats.toJson().errors[0]);
                return reject(1);
            }
            timer.end("DLL bundle creation");
            resolve(0);
        });
    });
}

export function getDllDependencies(config: SlimConfig): string[] {
    const additionalVendors = config.typescript && Array.isArray(config.typescript.vendors) ? config.typescript.vendors : [];
    return VENDORS.concat(POLYFILLS)
        .concat(additionalVendors)
        .map(vendor => {
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
            for (const dep of dllDependencies) {
                result = result && pkg.dependencies[dep] === dllCache.dependencies[dep];
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
    for (const dep of dllDependencies) {
        dllCache.dependencies[dep] = pkg.dependencies[dep];
    }
    if (!fs.existsSync(dllDir)) {
        fs.mkdirSync(dllDir);
    }
    fs.writeFileSync(dllCachePath, JSON.stringify(dllCache, null, 2), { encoding: "utf-8" });
}
