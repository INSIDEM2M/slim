import * as chalk from "chalk";
import * as path from "path";
import * as yargs from "yargs";
import { getEnvironment, getSlimConfig } from "../cli-helpers";
import { timer } from "../utils";

export const testCommand: yargs.CommandModule = {
    command: "test",
    describe: "Run the unit tests.",
    builder: {
        watch: {
            alias: "w",
            type: "boolean",
            description: "Watch the test und project files and re-run the unit tests on change."
        },
        coverage: {
            type: "boolean",
            alias: "c",
            description: "Create coverage report."
        },
        browsers: {
            type: "string",
            alias: "b",
            description: `Comma separated list of browsers to run the tests in. Example: ${chalk.default.bold(
                "chrome,firefox,safari"
            )}. Default is ${chalk.default.bold("chrome")}.`
        },
        "xml-report": {
            type: "string",
            description: "Create a xml junit report and save it to the specified file."
        }
    },
    handler: (options: Options) => {
        const dllTask = require("../tasks/dll.task");
        const testTask = require("../tasks/test.task");
        const rootDir = process.cwd();
        const slimConfig = getSlimConfig(rootDir);
        const environmentVariables = getEnvironment(rootDir);
        const browsers = parseBrowsers(options.browsers);
        if (!options.watch) {
            timer.start("Running the unit tests");
        }
        return (options.ci ? Promise.resolve(0) : dllTask(environmentVariables, slimConfig, options["update-dlls"]))
            .then(() =>
                testTask(
                    environmentVariables,
                    slimConfig,
                    options.watch,
                    options.ci ? true : options.coverage,
                    browsers,
                    options.ci ? path.join("test-reports", "unit-test-results.xml") : options["xml-report"]
                )
            )
            .then(code => {
                process.exit(code);
            })
            .catch(code => {
                process.exit(code);
            });
    }
};

function parseBrowsers(browserOption: string): string[] {
    return typeof browserOption === "string"
        ? browserOption.split(",").map(option =>
              option
                  .charAt(0)
                  .toUpperCase()
                  .concat(option.substr(1))
          )
        : ["Chrome"];
}
