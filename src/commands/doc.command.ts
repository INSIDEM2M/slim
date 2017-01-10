import * as yargs from "yargs";
import { getIm2mConfig, getEnvironment } from "../cli-helpers";

export const docCommand: yargs.CommandModule = {
    command: "doc",
    describe: "Create documentation for the current project.",
    handler: (options: Options) => {
        const rootDir = process.cwd();
        const im2mConfig = getIm2mConfig(rootDir);
        const environmentVariables = getEnvironment(rootDir);
        const docTask = require("../tasks/doc.task");
        return docTask(environmentVariables, im2mConfig).then(code => process.exit(code));
    }
};