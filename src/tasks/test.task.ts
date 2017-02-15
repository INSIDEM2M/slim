import * as path from "path";
import * as webpackMerge from "webpack-merge";
import * as karma from "karma";

import { getAvailablePort } from "../cli-helpers";
import { getCommonConfigPartial } from "../webpack/webpack.config.common";
import { getTestConfigPartial } from "../webpack/webpack.config.test";
import { getKarmaConfig } from "../config/karma.conf";
import { logger, timer } from "../utils";
import { SlimConfig } from "../config/slim-typings/slim-config";

module.exports = function (env: Environment, config: SlimConfig, watch: boolean, coverage: boolean, browsers: string[], xmlReport: string) {
    return getAvailablePort().then(port => {
        const indexPath = path.join(config.sourceDir, "index.html");
        const polyfillsPattern = path.join(config.dllDir, "polyfills.dll.js");
        const vendorsPattern = path.join(config.dllDir, "vendors.dll.js");
        const testSetupPattern = path.resolve(__dirname, "..", "config", "test-bundle.js");

        const commonConfig = getCommonConfigPartial(indexPath, env, config, true, false);
        const testConfig: any = getTestConfigPartial(config);
        const webpackConfig = webpackMerge(commonConfig, testConfig);
        const karmaConfig = getKarmaConfig(testSetupPattern, vendorsPattern, polyfillsPattern, port, watch, coverage, config.coverageDir, webpackConfig, browsers, typeof xmlReport === "string" ? path.join(config.rootDir, xmlReport) : null, config.sass.globalStyles);
        logger.info("Building test bundle...");
        return new Promise((resolve) => {
            const server = new karma.Server(karmaConfig, (exitCode) => {
                if (!watch) {
                    timer.end("Running the unit tests");
                }
                if (coverage) {
                    logger.info("Wrote coverage report to " + config.coverageDir + ".");
                }
                resolve(exitCode);
            });
            server.start();
        });
    });
};