import * as path from "path";
import * as webpack from "webpack";
import * as webpackMerge from "webpack-merge";
import * as rimraf from "rimraf";

import { getCommonConfigPartial } from "../webpack/webpack.config.common";
import { getBuildConfigPartial } from "../webpack/webpack.config.build";
import { timer, logger } from "../utils";
import { SlimConfig } from "../config/slim-typings/slim-config";
import { prettyPrintConfig } from "../cli-helpers";
import { argv } from "yargs";
import * as fs from "fs";

module.exports = function (env: Environment, config: SlimConfig, minify: boolean, aot: boolean, skipSourceMaps: boolean) {
    rimraf.sync(config.targetDir);
    logger.debug("Deleted " + config.targetDir);
    const indexPath = path.join(config.sourceDir, "index.html");
    const commonConfig = getCommonConfigPartial(indexPath, env, config, false, aot);
    const buildConfig = getBuildConfigPartial(config, minify, indexPath, skipSourceMaps);
    const webpackConfig = webpackMerge.smart(commonConfig, buildConfig);
    logger.debug("Created webpack build config.", prettyPrintConfig(webpackConfig));
    logger.info(`Building ${minify ? "minified " : ""}application${aot ? " using the Angular AOT compiler" : ""}...`);
    return runBuild(webpackConfig, config);
};

function runBuild(config: webpack.Configuration, conf: SlimConfig) {
    timer.start("Application build");
    return new Promise((resolve, reject) => {
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
                    logger.error(jsonStats.errors);
                }
                return reject(1);
            }
            if (argv["debug"]) {
                fs.writeFileSync(path.join(conf.targetDir, "stats.json"), JSON.stringify(stats.toJson()), { encoding: "utf-8" });
            }
            timer.end("Application build");
            resolve(0);
        });
    });
}