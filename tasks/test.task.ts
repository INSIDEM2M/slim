import * as path from "path";
import * as webpack from "webpack";
import * as webpackMerge from "webpack-merge";
import * as karma from "karma";
import * as glob from "glob";

import { getAvailablePort } from "../cli-helpers";
import { getCommonConfigPartial } from "../webpack/webpack.config.common";
import { getTestConfigPartial } from "../webpack/webpack.config.test";
import { getDevConfigPartial } from "../webpack/webpack.config.dev";
import { getKarmaConfig } from "../karma.conf";
import { logger } from "../logger";

export default function (env: EnvironmentVariables, config: IM2MConfig, watch: boolean, coverage: boolean) {
    return getAvailablePort().then(port => {
        const indexPath = path.join(config.sourceDir, "index.html");
        const testFile = path.join(config.targetDir, "tests.js");
        const testFiles = glob.sync(path.join(config.sourceDir, "**", "*.spec.ts"));
        const polyfillsFile = path.join(config.targetDir, "polyfills.dll.js");
        const vendorsFile = path.join(config.targetDir, "vendors.dll.js");
        const karmaConfig = getKarmaConfig(testFile, polyfillsFile, vendorsFile, port, watch, coverage, config.coverageDir);
        const commonConfig = getCommonConfigPartial(indexPath, env, config);
        const testConfig = getTestConfigPartial(config.targetDir, config.sourceDir, path.join(__dirname, "test-bundle.ts"), testFiles, config.dllDir);
        const webpackConfig = (webpackMerge as any).strategy({
            "entry": "replace"
        })(commonConfig, testConfig);
        const compiler = webpack(webpackConfig);
        return buildTest(compiler, watch)
            .then(() => {
                return new Promise((resolve, reject) => {
                    const server = new karma.Server(karmaConfig, (exitCode) => {
                        resolve(exitCode);
                    });
                    server.start();
                })
            });
    });
}

function buildTest(compiler: webpack.compiler.Compiler, watch: boolean) {
    return new Promise((resolve, reject) => {
        if (!watch) {
            compiler.run((error, stats) => {
                if (stats.hasErrors()) {
                    return reject(stats.toJson().errors[0]);
                }
                resolve(0);
            });
        } else {
            compiler.watch({}, (error, stats) => {
                if (stats.hasErrors()) {
                    logger.error(stats.toJson().errors[0]);
                }
                resolve(0);
            });
        }
    });
}