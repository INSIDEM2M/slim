import * as fs from "fs";
import * as path from "path";
import * as rimraf from "rimraf";
import * as webpack from "webpack";
import * as webpackMerge from "webpack-merge";
import { argv } from "yargs";
import { prettyPrintConfig } from "../cli-helpers";
import { SlimConfig } from "../config/slim-typings/slim-config";
import { logger, timer } from "../utils";
import { extractBundles } from "../webpack/plugins/chunk.plugin";
import { getBuildConfigPartial } from "../webpack/webpack.config.build";
import { getCommonConfigPartial } from "../webpack/webpack.config.common";

module.exports = function(
    env: Environment,
    config: SlimConfig,
    minify: boolean,
    aot: boolean,
    skipSourceMaps: boolean,
    codesplit: boolean
) {
    rimraf.sync(config.targetDir);
    logger.debug("Deleted " + config.targetDir);
    let webpackConfig;
    try {
        const indexPath = path.join(config.sourceDir, "index.html");
        const commonConfig = getCommonConfigPartial(indexPath, env, config, false, aot);
        const buildConfig = getBuildConfigPartial(config, minify, indexPath, skipSourceMaps);
        const codesplitConfig = codesplit
            ? extractBundles([
                  {
                      name: "vendor",
                      minChunks: isVendor // extract node_modules
                  },
                  {
                      name: "manifest" // extract webpack runtime code
                  }
              ])
            : undefined;
        webpackConfig = webpackMerge.smart(commonConfig, buildConfig, codesplitConfig);
        logger.debug("Created webpack build config.", prettyPrintConfig(webpackConfig));
        logger.info(`Building ${minify ? "minified " : ""}application${aot ? " using the Angular AOT compiler" : ""}...`);
    } catch (err) {
        logger.error(err);
    }
    return runBuild(webpackConfig, config);
};

function isVendor({ resource }) {
    return resource && resource.indexOf("node_modules") >= 0 && resource.match(/\.js$/);
}

function onlyTemplateErrors(errors: string[]) {
    return errors.reduce((prev, curr) => prev && isTemplateError(curr), true);
}

function isTemplateError(error: string) {
    return error.startsWith("ng://") || error.includes("$$_gendir");
}

function runBuild(config: webpack.Configuration, conf: SlimConfig) {
    timer.start("Application build");
    return new Promise((resolve, reject) => {
        try {
            webpack(config, (error, stats) => {
                if (error) {
                    logger.error(error);
                    return reject(1);
                }
                if (!stats) {
                    return reject(1);
                } else if (stats.hasErrors()) {
                    const jsonStats = stats.toJson();
                    if (jsonStats.errors && jsonStats.errors.length > 0) {
                        for (const e of jsonStats.errors as string[]) {
                            const prettyError = e.replace(conf.rootDir + "/", "");
                            if (isTemplateError(prettyError)) {
                                logger.warn(prettyError.replace("ng://", "").replace("$$_gendir", ""));
                            } else {
                                logger.error(prettyError);
                            }
                        }
                    }
                    if (conf.typescript.typecheck && !onlyTemplateErrors(jsonStats.errors)) {
                        return reject(1);
                    }
                }
                if (argv["debug"]) {
                    fs.writeFileSync(path.join(conf.targetDir, "stats.json"), JSON.stringify(stats.toJson()), { encoding: "utf-8" });
                }
                timer.end("Application build");
                resolve(0);
            });
        } catch (err) {
            logger.error(err);
        }
    });
}
