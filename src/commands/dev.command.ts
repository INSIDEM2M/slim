import * as yargs from "yargs";
import { getSlimConfig, getEnvironment } from "../cli-helpers";

export const devCommand: yargs.CommandModule = {
    command: "dev",
    describe: "Start a development server.",
    builder: {
        "open": {
            alias: "o",
            type: "boolean",
            description: "Automatically open the web browser."
        },
        "update-dlls": {
            alias: "u",
            type: "boolean",
            description: "Create dynamically linked libraries for vendors (@angular/core, etc.) and polyfills. This has to be run after the dependencies have been updated."
        },
        "aot": {
            type: "boolean",
            description: "Use the Angular AOT compiler."
        }
    },
    handler: (options: Options) => {
        const dllTask = require("../tasks/dll.task");
        const devTask = require("../tasks/dev.task");
        const rootDir = process.cwd();
        const slimConfig = getSlimConfig(rootDir);
        const environmentVariables = getEnvironment(rootDir);
        return dllTask(environmentVariables, slimConfig, options["update-dlls"])
            .then(() => devTask(environmentVariables, slimConfig, options.open, options.aot))
            .then(code => {
                process.exit(code);
            })
            .catch((code) => {
                process.exit(code);
            });
    }
};