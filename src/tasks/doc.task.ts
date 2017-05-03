import { spawn } from "child_process";
import * as path from "path";
import { logger } from "../utils";
import { SlimConfig } from "../config/slim-typings/slim-config";
import { argv } from "yargs";

module.exports = function (env: Environment, config: SlimConfig) {
    logger.info("Creating documentation...");
    let args = ["--tsconfig", "tsconfig.json", "--hideGenerator", "--disableGraph", "--output", "docs", "--toggleMenuItems", "components,directives,injectables,interfaces,pipes,classes", "--disablePrivateOrInternalSupport"];
    if (!argv["debug"]) {
        args.push("--silent");
    }
    const docProcess = spawn(getCompodocBinaryPath(), args, {
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