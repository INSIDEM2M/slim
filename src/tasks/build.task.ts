import * as path from "path";
import * as webpack from "webpack";
import * as webpackMerge from "webpack-merge";
import * as rimraf from "rimraf";

import { getCommonConfigPartial } from "../webpack/webpack.config.common";
import { getBuildConfigPartial } from "../webpack/webpack.config.build";
import { timer, logger } from "../logger";
import { SlimConfig } from "../config/slim-config/slim-config";

module.exports = function (env: EnvironmentVariables, config: SlimConfig, minify: boolean, aot: boolean) {
    rimraf.sync(config.targetDir);
    logger.debug("Deleted " + config.targetDir);
    const indexPath = path.join(config.sourceDir, "index.html");
    const commonConfig = getCommonConfigPartial(indexPath, env, config);
    const buildConfig = getBuildConfigPartial(config, minify, aot, indexPath);
    const webpackConfig = webpackMerge(commonConfig, buildConfig);
    logger.info(`Building ${minify ? "minified " : ""}application${aot ? " using the Angular AOT compiler" : ""}...`);
    return runBuild(webpackConfig);
};

function runBuild(config: webpack.Configuration) {
    timer.start("Application build");
    return new Promise((resolve, reject) => {
        webpack(config, (error, stats) => {
            if (!stats || stats.hasErrors()) {
                return reject(stats ? stats.toJson().errors[0] : 1);
            }
            timer.end("Application build");
            resolve(0);
        });
    });
}