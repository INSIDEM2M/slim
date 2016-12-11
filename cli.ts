import { getCommandLineUsage, getCommand, getOptions, getIm2mConfig, getEnvironment, parseBrowsers } from "./cli-helpers";
import devTask from "./tasks/dev.task";
import dllTask from "./tasks/dll.task";
import buildTask from "./tasks/build.task";
import serveTask from "./tasks/serve.task";
import testTask from "./tasks/test.task";

export function main() {

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
            if (options["update-dlls"]) {
                exitCode = dllTask(environmentVariables, im2mConfig).then(() => devTask(environmentVariables, im2mConfig, options.open));
            } else {
                exitCode = devTask(environmentVariables, im2mConfig, options.open);
            }
            break;
        case "build":
            if (options["serve"]) {
                exitCode = buildTask(environmentVariables, im2mConfig, options.minify, options.aot).then(() => serveTask(environmentVariables, im2mConfig, options.open));
            } else {
                exitCode = buildTask(environmentVariables, im2mConfig, options.minify, options.aot);
            }
            break;
        case "test":
            const browsers = parseBrowsers(options.browsers);
            exitCode = testTask(environmentVariables, im2mConfig, options.watch, options.coverage, browsers);
            break;
        case "e2e":
            // Run E2E tests
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