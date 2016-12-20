import * as yargs from "yargs";
import * as chalk from "chalk";
import { getIm2mConfig, getEnvironment, parseBrowsers } from "../cli-helpers";
import dllTask from "../tasks/dll.task";
import testTask from "../tasks/test.task";
import { timer } from "../logger";

export const testCommand: yargs.CommandModule = {
    command: "test",
    describe: "Run the unit tests.",
    builder: {
        "watch": {
            alias: "w",
            type: "boolean",
            description: "Watch the test und project files and re-run the unit tests on change."
        },
        "coverage": {
            type: "boolean",
            alias: "c",
            description: "Create coverage report."
        },
        "browsers": {
            type: "string",
            alias: "b",
            description: `Comma separated list of browsers to run the tests in. Example: ${chalk.bold("chrome,firefox,safari")}. Default is ${chalk.bold("chrome")}.`
        },
        "xml-report": {
            type: "string",
            description: "Create a xml junit report and save it to the specified file."
        }
    },
    handler: (options: Options) => {
        const rootDir = process.cwd();
        const im2mConfig = getIm2mConfig(rootDir);
        const environmentVariables = getEnvironment(rootDir);
        const browsers = parseBrowsers(options.browsers);
        if (!options.watch) {
            timer.start("Running the unit tests");
        }
        return dllTask(environmentVariables, im2mConfig, options["update-dlls"])
            .then(() => testTask(environmentVariables, im2mConfig, options.watch, options.coverage, browsers, options["xml-report"]))
            .then((exitCode: number) => process.exit(exitCode));
    }
}