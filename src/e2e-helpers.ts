import * as path from "path";
import { spawn } from "child_process";
import { logger } from "./logger";

function getProtractorDir() {
    var result = require.resolve("protractor");
    if (result) {
        // result is now something like
        // c:\\Source\\gulp-protractor\\node_modules\\protractor\\lib\\protractor.js
        return path.resolve(path.join(path.dirname(result), "..", "..", ".bin"));
    }
    throw new Error("No protractor installation found.");
}

function getProtractorBinaryPath(binaryName) {
    var winExt = /^win/.test(process.platform) ? ".cmd" : "";
    return path.join(getProtractorDir(), binaryName + winExt);
}

export function webDriverUpdate(): Promise<number> {
    return new Promise((resolve) => {
        const wdProcess = spawn(getProtractorBinaryPath("webdriver-manager"), ["update"], { stdio: "inherit" });
        wdProcess.on("close", (exitCode) => {
            resolve(exitCode);
        });
    });
}

export function runProtractor(port: number, specs: string) {
    return new Promise((resolve) => {
        const configPath = path.resolve("/", path.join(__dirname, "config", "protractor.conf.js"));
        logger.debug(`Running the following command: protractor ${configPath} --port ${port} --specs ${specs}`);
        const protractorProcess = spawn(getProtractorBinaryPath("protractor"), [configPath , "--port", String(port), "--specs", specs], { stdio: "inherit" })
        protractorProcess.on("close", (exitCode) => {
            resolve(exitCode);
        });
    });
}