import * as yargs from "yargs";
import { getIm2mConfig, getEnvironment } from "../cli-helpers";
import dllTask from "../tasks/dll.task";
import devTask from "../tasks/dev.task";

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
        }
    },
    handler: (options: Options) => {
        const rootDir = process.cwd();
        const im2mConfig = getIm2mConfig(rootDir);
        const environmentVariables = getEnvironment(rootDir);
        return dllTask(environmentVariables, im2mConfig, options["update-dlls"]).then(() => devTask(environmentVariables, im2mConfig, options.open));
    }
};