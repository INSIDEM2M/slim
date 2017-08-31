import * as chalk from "chalk";
import { Server } from "http";
import * as path from "path";
import * as readline from "readline";
import * as webpack from "webpack";
import * as WebpackDevServer from "webpack-dev-server";
import * as webpackMerge from "webpack-merge";
import { getAvailablePort, openBrowser, prettyPrintConfig } from "../cli-helpers";
import { SlimConfig } from "../config/slim-typings/slim-config";
import { logger } from "../utils";
import { getCommonConfigPartial } from "../webpack/webpack.config.common";
import { getDevConfigPartial } from "../webpack/webpack.config.dev";

module.exports = function(env: Environment, config: SlimConfig, open: boolean, aot: boolean) {
    return getAvailablePort().then(port => {
        const webpackConfig = createWebpackDevConfig(env, config, port, aot);
        const compiler = webpack(webpackConfig);
        logger.info(`Started webpack development server at port ${port}.`);
        logger.info("Go to " + chalk.underline("http://localhost:" + port) + " to view the application.");
        const server = new WebpackDevServer(compiler, webpackConfig.devServer);
        return startServer(server, port, open, config.baseHref);
    });
};

function createWebpackDevConfig(env: Environment, config: SlimConfig, port: number, aot: boolean): webpack.Configuration {
    const indexPath = path.join(config.sourceDir, "index.html");
    const commonConfig = getCommonConfigPartial(indexPath, env, config, false, aot);
    const devConfig = getDevConfigPartial(config, indexPath, aot, port);
    const webpackConfig = webpackMerge.smart(commonConfig, devConfig);
    logger.debug("Created webpack development config.", prettyPrintConfig(webpackConfig));
    return webpackConfig;
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
