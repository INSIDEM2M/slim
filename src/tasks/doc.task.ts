import { spawn } from "child_process";
import * as path from "path";
import { logger } from "../utils";
import { SlimConfig } from "../config/slim-typings/slim-config";

module.exports = function (env: Environment, config: SlimConfig) {
    logger.info("Creating documentation...");
    const docProcess = spawn(getCompodocBinaryPath(), ["--tsconfig", "tsconfig.json", "--theme", "vagrant", "--hideGenerator", "--disableGraph", "--output", "docs"], {
        cwd: config.rootDir,
        stdio: "inherit"
    });
    return new Promise((resolve) => {
        docProcess.on("exit", (exitCode) => {
            resolve(exitCode);
        });
    });
};

function getCompodocBinaryPath() {
    return path.resolve(__dirname, "..", "..", "node_modules", ".bin", "compodoc");
}