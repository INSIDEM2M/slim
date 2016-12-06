import { getAvailablePort } from "../cli-helpers";
import * as opn from "opn";
import * as localWebServer from "local-web-server";
import { Server } from "http";
import { logger } from "../logger";

export default function (env: EnvironmentVariables, config: IM2MConfig, open: boolean) {
    return getAvailablePort().then(port => {
        const server = localWebServer({
            static: {
                root: config.targetDir
            },
            compress: true,
            log: {
                format: "tiny"
            }
        });
        logger.info("Started http server at port " + port);
        return startServer(server, port, open);
    });
}

function startServer(server: Server, port: number, open: boolean) {
    return new Promise((resolve, reject) => {
        const s = server.listen(port);
        if (open) {
            opn(`http://localhost:${port}`);
        }
    });
}