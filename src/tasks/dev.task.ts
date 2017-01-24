import * as WebpackDevServer from "webpack-dev-server";
import * as webpackMerge from "webpack-merge";
import * as webpack from "webpack";
import * as path from "path";
import { Server } from "http";

import { getCommonConfigPartial } from "../webpack/webpack.config.common";
import { getDevConfigPartial } from "../webpack/webpack.config.dev";
import { getAvailablePort, openBrowser } from "../cli-helpers";
import { logger } from "../logger";
import * as chalk from "chalk";
import * as readline from "readline";
import { SlimConfig } from "../config/slim-config/slim-config";

module.exports = function (env: EnvironmentVariables, config: SlimConfig, open: boolean) {
    return getAvailablePort().then(port => {
        const webpackConfig = createWebpackDevConfig(env, config, port);
        const compiler = webpack(webpackConfig);
        logger.info(`Started webpack development server at port ${port}.`);
        logger.info("Go to " + chalk.underline("http://localhost:" + port) + " to view the application.");
        const server = new WebpackDevServer(compiler, webpackConfig.devServer);
        return startServer(server, port, open, config.baseHref);
    });
};

function createWebpackDevConfig(env: EnvironmentVariables, config: SlimConfig, port: number): webpack.Configuration {
    const indexPath = path.join(config.sourceDir, "index.html");
    const commonConfig = getCommonConfigPartial(indexPath, env, config);
    const devConfig = getDevConfigPartial(config, indexPath, port);
    const webpackConfig = webpackMerge(commonConfig, devConfig);
    logger.trace("Created webpack development config.", prettyPrintConfig(webpackConfig));
    return webpackConfig;
}

function prettyPrintConfig(webpackConfig: webpack.Configuration): string {
    const replacerFn = (key: string, value: any) => {
        // Filter webpack.DllReferencePlugin manifest entries
        if (value && value["options"] !== undefined && value["options"]["context"] !== undefined) {
            return undefined;
        }
        return value;
    };
    return JSON.stringify(webpackConfig, replacerFn, 2);
}

function startServer(server: Server | any, port: number, open: boolean, baseHref: string) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise((resolve, reject) => {
        const s = server.listen(port);
        s.on("close", () => {
            resolve(0);
        });
        if (open) {
            logger.debug("Opening browser at " + `http://localhost:${port}${baseHref}.`);
            openBrowser("localhost", port, baseHref);
        } else {
            const timeout = setTimeout(() => {
                logger.debug("Did not receive enter key. Closing input stream.");
                rl.close();
            }, 10000);
            rl.question("================> Press enter during the next 10s to open the browser...\n", () => {
                clearTimeout(timeout);
                rl.close();
                openBrowser("localhost", port, baseHref);
            });
        }
    });
}