import { Server } from "http";
import * as opn from "opn";
import { getAvailablePort } from "../cli-helpers";
import { SlimConfig } from "../config/slim-typings/slim-config";
import { logger } from "../utils";

module.exports = function(
    env: Environment,
    config: SlimConfig,
    open: boolean,
    forcePort?: number,
    quitAfterStart?: boolean,
    silent: boolean = true
) {
    return getAvailablePort().then(port => {
        const localWebServer = require("local-web-server");
        const server = localWebServer({
            static: {
                root: config.targetDir
            },
            compress: true,
            log: {
                format: silent ? "none" : "tiny"
            }
        });
        logger.info("Starting http server at port " + port + "...");
        return startServer(server, forcePort ? forcePort : port, open, quitAfterStart);
    });
};

function startServer(server: Server, port: number, open: boolean, quitAfterStart?: boolean): Promise<number> {
    return new Promise((resolve, reject) => {
        server.listen(port);
        if (open) {
            opn(`http://localhost:${port}`);
        }
        logger.debug("Server started.");
        if (quitAfterStart) {
            resolve(port);
        }
    });
}
