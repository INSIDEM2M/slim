import { getCommandLineUsage, getCommand, getOptions, getIm2mConfig, getEnvironment, parseBrowsers, getAvailablePort } from "./cli-helpers";
import devTask from "./tasks/dev.task";
import dllTask from "./tasks/dll.task";
import buildTask from "./tasks/build.task";
import serveTask from "./tasks/serve.task";
import testTask from "./tasks/test.task";
import e2eTask from "./tasks/e2e.task";
import * as readline from "readline";
import { timer } from "./logger";

export function main() {

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on("SIGINT", () => {
        process.exit(0);
    });

    const command = getCommand();
    const options = getOptions();
    const rootDir = process.cwd();

    const im2mConfig = getIm2mConfig(rootDir);
    const environmentVariables = getEnvironment(rootDir);

    let exitCode: Promise<number>;
    switch (command) {
        case "new":
            // Create new project/component
            break;
        case "dev":
            exitCode = dllTask(environmentVariables, im2mConfig, options["update-dlls"]).then(() => devTask(environmentVariables, im2mConfig, options.open));
            break;
        case "build":
            if (options.serve) {
                exitCode = buildTask(environmentVariables, im2mConfig, options.minify, options.aot).then(() => serveTask(environmentVariables, im2mConfig, options.open));
            } else {
                exitCode = buildTask(environmentVariables, im2mConfig, options.minify, options.aot);
            }
            break;
        case "test":
            const browsers = parseBrowsers(options.browsers);
            if (!options.watch) {
                timer.start("Running the unit tests");
            }
            exitCode = dllTask(environmentVariables, im2mConfig, options["update-dlls"]).then(() => testTask(environmentVariables, im2mConfig, options.watch, options.coverage, browsers, options["xml-report"]));
            break;
        case "e2e":
            exitCode = (options["no-build"] ? Promise.resolve() : buildTask(environmentVariables, im2mConfig, options.minify, options.aot))
                .then(() => getAvailablePort())
                .then((port) => serveTask(environmentVariables, im2mConfig, options.open, port, true))
                .then((port) => e2eTask(environmentVariables, im2mConfig, port, options["no-update"], options.specs));
            break;
        case "release":
            // Update version
            break;
        case "changelog":
            // Update changelog
            break;
        case "publish":
            // Push to npm/git
            break;
        default:
            console.log(getCommandLineUsage());
            break;
    }
    Promise.resolve(exitCode).then(code => {
        process.exit(code);
    });
}