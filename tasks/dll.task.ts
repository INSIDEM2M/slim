import * as path from "path";
import * as webpack from "webpack";
import * as webpackMerge from "webpack-merge";

import { getCommonConfigPartial } from "../webpack/webpack.config.common";
import { getDllConfigPartial } from "../webpack/webpack.config.dll";
import * as fs from "fs";
import { getDllDependencies, dllsUpToDate, writeDllCache } from "../cli-helpers";
import { logger, timer } from "../logger";

const DLL_CACHE_FILE_NAME = "dll.cache.json";

export default function (env: EnvironmentVariables, config: IM2MConfig, forceUpdate: boolean) {
    const pkg = JSON.parse(fs.readFileSync(path.join(config.rootDir, "package.json"), "utf-8"));
    const dllDependencies = getDllDependencies(config);
    if (forceUpdate) {
        logger.debug("Forced DLL cache update.");
        return updateDlls(env, config, dllDependencies, pkg);
    } else {
        if (dllsUpToDate(config.dllDir, DLL_CACHE_FILE_NAME, pkg, dllDependencies)) {
            logger.info("Found up-to-date DLL cache.");
            return Promise.resolve();
        } else {
            return updateDlls(env, config, dllDependencies, pkg);
        }
    }
}

function updateDlls(env: EnvironmentVariables, config: IM2MConfig, dllDependencies: string[], pkg: any) {
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