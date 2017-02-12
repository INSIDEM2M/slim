import * as path from "path";
import { spawn } from "child_process";
import { logger } from "../utils";
import { SlimConfig } from "../config/slim-typings/slim-config";

module.exports = function (env: Environment, config: SlimConfig, port: number, skipWebDriverUpdate: boolean, specs?: string) {
    return (skipWebDriverUpdate ? Promise.resolve(0) : webDriverUpdate()).then((exitCode) => {
        if (exitCode === 0) {
            let specPaths = path.join(config.e2eDir, "**", "*.e2e.ts");
            if (specs) {
                specPaths = specs.split(",").map(spec => path.resolve(path.join(__dirname, "..", "config"), path.join(config.rootDir, spec))).join(",");
            }
            return runProtractor(port, specPaths);
        } else {
            return exitCode;
        }
    });
};

function getProtractorDir() {
    let result = require.resolve("protractor");
    if (result) {
        // result is now something like
        // c:\\Source\\gulp-protractor\\node_modules\\protractor\\lib\\protractor.js
        return path.resolve(path.join(path.dirname(result), "..", "..", ".bin"));
    }
    throw new Error("No protractor installation found.");
}

function getProtractorBinaryPath(binaryName) {
    const winExt = /^win/.test(process.platform) ? ".cmd" : "";
    return path.join(getProtractorDir(), binaryName + winExt);
}

function webDriverUpdate(): Promise<number> {
    return new Promise((resolve) => {
        const wdProcess = spawn(getProtractorBinaryPath("webdriver-manager"), ["update"], { stdio: "inherit" });
        wdProcess.on("close", (exitCode) => {
            resolve(exitCode);
        });
    });
}

function runProtractor(port: number, specs: string) {
    return new Promise((resolve) => {
        const configPath = path.resolve("/", path.join(__dirname, "..", "config", "protractor.conf.js"));
        logger.debug(`Running the following command: protractor ${configPath} --specs ${specs}`);
        const protractorProcess = spawn(getProtractorBinaryPath("protractor"), [configPath, "--specs", specs, "--baseUrl", `http://localhost:${port}`], { stdio: "inherit" });
        protractorProcess.on("close", (exitCode) => {
            resolve(exitCode);
        });
    });
}