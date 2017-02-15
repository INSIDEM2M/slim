import * as yargs from "yargs";
import { getSlimConfig, getEnvironment } from "../cli-helpers";

export const docCommand: yargs.CommandModule = {
    command: "doc",
    describe: "Create documentation for the current project.",
    handler: (options: Options) => {
        const rootDir = process.cwd();
        const slimConfig = getSlimConfig(rootDir);
        const environmentVariables = getEnvironment(rootDir);
        const docTask = require("../tasks/doc.task");
        return docTask(environmentVariables, slimConfig)
            .then(code => {
                process.exit(code);
            })
            .catch((code) => {
                process.exit(code);
            });
    }
};