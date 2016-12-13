import * as path from "path";
import * as webpack from "webpack";
import * as webpackMerge from "webpack-merge";

import { getCommonConfigPartial } from "../webpack/webpack.config.common";
import { getBuildConfigPartial } from "../webpack/webpack.config.build";
import { timer, logger } from "../logger";

export default function (env: EnvironmentVariables, config: IM2MConfig, minify: boolean, aot: boolean) {
    const indexPath = path.join(config.sourceDir, "index.html");
    const commonConfig = getCommonConfigPartial(indexPath, env, config);
    const buildConfig = getBuildConfigPartial(indexPath, config.targetDir, config.typescript.output, config.typescript.entry, minify, aot, aot ? path.join(config.rootDir, config.angular.aotTsConfig) : null, aot ? path.join(config.sourceDir, config.angular.appModule) : null);
    const webpackConfig = webpackMerge(commonConfig, buildConfig);
    logger.info(`Building ${minify ? "minified " : ""}application${aot ? " using the Angular AOT compiler" : ""}...`);
    return runBuild(webpackConfig);
}

function runBuild(config: webpack.Configuration) {
    timer.start("Application build");
    return new Promise((resolve, reject) => {
        webpack(config, (error, stats) => {
            if (stats.hasErrors()) {
                return reject(stats.toJson().errors[0]);
            }
            timer.end("Application build");
            resolve(0);
        });
    });
}