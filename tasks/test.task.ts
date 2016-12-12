import * as path from "path";
import * as webpackMerge from "webpack-merge";
import * as karma from "karma";

import { getAvailablePort } from "../cli-helpers";
import { getCommonConfigPartial } from "../webpack/webpack.config.common";
import { getTestConfigPartial } from "../webpack/webpack.config.test";
import { getKarmaConfig } from "../karma.conf";
import { logger, timer } from "../logger";

export default function (env: EnvironmentVariables, config: IM2MConfig, watch: boolean, coverage: boolean, browsers: string[], xmlReport: string) {
    return getAvailablePort().then(port => {
        const indexPath = path.join(config.sourceDir, "index.html");
        const polyfillsPattern = path.join(config.dllDir, "polyfills.dll.js");
        const vendorsPattern = path.join(config.dllDir, "vendors.dll.js");
        const testSetupPattern = path.join(config.rootDir, "test-bundle.ts");

        const commonConfig = getCommonConfigPartial(indexPath, env, config);
        const testConfig = getTestConfigPartial(config.targetDir, config.sourceDir, config.dllDir);
        const webpackConfig = (webpackMerge as any).strategy({
            "entry": "replace"
        })(commonConfig, testConfig);
        const karmaConfig = getKarmaConfig(testSetupPattern, vendorsPattern, polyfillsPattern, port, watch, coverage, config.coverageDir, webpackConfig, browsers, typeof xmlReport === "string" ? path.join(config.rootDir, xmlReport) : null);
        logger.info("Building test bundle...");
        return new Promise((resolve) => {
            const server = new karma.Server(karmaConfig, (exitCode) => {
                if (!watch) {
                    timer.end("Running the unit tests");
                }
                resolve(exitCode);
            });
            server.start();
        });
    });
}