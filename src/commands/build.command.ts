import * as yargs from "yargs";
import { getSlimConfig, getEnvironment } from "../cli-helpers";

export const buildCommand: yargs.CommandModule = {
    command: "build",
    describe: "Bundle the application using webpack and put the result in the targetDir (default: www) of the project.",
    builder: {
        "minify": {
            alias: "m",
            type: "boolean",
            description: "Use UglifyJS to minify the bundle."
        },
        "aot": {
            type: "boolean",
            description: "Use the Angular AOT compiler."
        },
        "serve": {
            type: "boolean",
            alias: "s",
            description: "Serve the application after it was built."
        }
    },
    handler: (options: Options) => {
        const rootDir = process.cwd();
        const slimConfig = getSlimConfig(rootDir);
        const environmentVariables = getEnvironment(rootDir);
        let exitCode: Promise<number>;
        const buildTask = require("../tasks/build.task");
        const serveTask = require("../tasks/serve.task");
        if (options.serve) {
            exitCode = buildTask(environmentVariables, slimConfig, options.minify, options.aot).then(() => serveTask(environmentVariables, slimConfig, options.open));
        } else {
            exitCode = buildTask(environmentVariables, slimConfig, options.minify, options.aot);
        }
        exitCode
            .then(code => {
                process.exit(code);
            })
            .catch((code) => {
                process.exit(code);
            });
    }
};