import * as yargs from "yargs";
import { getSlimConfig, getEnvironment, getAvailablePort } from "../cli-helpers";

export const e2eCommand: yargs.CommandModule = {
    command: "e2e",
    describe: "Run the E2E tests.",
    builder: {
        "skip-build": {
            type: "boolean",
            description: "Use the last build for the E2E test."
        },
        "skip-update": {
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
        const slimConfig = getSlimConfig(rootDir);
        const environmentVariables = getEnvironment(rootDir);
        (options["skip-build"] === true ? Promise.resolve(0) : buildTask(environmentVariables, slimConfig, options.minify, options.aot))
            .then(() => getAvailablePort())
            .then((port) => serveTask(environmentVariables, slimConfig, options.open, port, true))
            .then((port) => e2eTask(environmentVariables, slimConfig, port, options["skip-update"], options.specs))
            .then(code => {
                process.exit(code);
            })
            .catch((code) => {
                process.exit(code);
            });
    }
};