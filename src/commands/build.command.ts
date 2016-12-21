import * as yargs from "yargs";
import { getIm2mConfig, getEnvironment } from "../cli-helpers";

export const buildCommand: yargs.CommandModule = {
    command: "build",
    describe: "Bundle the application using webpack.",
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
        const im2mConfig = getIm2mConfig(rootDir);
        const environmentVariables = getEnvironment(rootDir);
        let exitCode: Promise<number>;
        const buildTask = require("../tasks/build.task");
        const serveTask = require("../tasks/serve.task");
        if (options.serve) {
            exitCode = buildTask(environmentVariables, im2mConfig, options.minify, options.aot).then(() => serveTask(environmentVariables, im2mConfig, options.open));
        } else {
            exitCode = buildTask(environmentVariables, im2mConfig, options.minify, options.aot);
        }
        exitCode.then(code => {
            process.exit(code);
        });
    }
};