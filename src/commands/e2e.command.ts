import * as yargs from "yargs";
import { getIm2mConfig, getEnvironment, getAvailablePort } from "../cli-helpers";

export const e2eCommand: yargs.CommandModule = {
    command: "e2e",
    describe: "Run the E2E tests.",
    builder: {
        "no-build": {
            type: "boolean",
            description: "Use the last build for the E2E test."
        },
        "no-update": {
            type: "boolean",
            description: "Do not update the webdriver binaries."
        },
        "specs": {
            type: "string",
            description: "Only run the these E2E tests."
        }
    },
    handler: (options: Options) => {
        const e2eTask = require("../tasks/e2e.task");
        const serveTask = require("../tasks/serve.task");
        const buildTask = require("../tasks/build.task");
        const rootDir = process.cwd();
        const im2mConfig = getIm2mConfig(rootDir);
        const environmentVariables = getEnvironment(rootDir);
        (options["no-build"] ? Promise.resolve() : buildTask(environmentVariables, im2mConfig, options.minify, options.aot))
            .then(() => getAvailablePort())
            .then((port) => serveTask(environmentVariables, im2mConfig, options.open, port, true))
            .then((port) => e2eTask(environmentVariables, im2mConfig, port, options["no-update"], options.specs))
            .then((exitCode: number) => {
                process.exit(exitCode);
            });
    }
};