import * as yargs from "yargs";
import * as readline from "readline";
import { devCommand } from "./commands/dev.command";
import { buildCommand } from "./commands/build.command";
import { testCommand } from "./commands/test.command";
import { e2eCommand } from "./commands/e2e.command";
import { publishCommand } from "./commands/publish.command";
import { releaseCommand } from "./commands/release.command";
import { newCommand } from "./commands/new.command";
import * as chalk from "chalk";
import * as path from "path";
import { docCommand } from "./commands/doc.command";
import * as fs from "fs";
import * as os from "os";
import { spawn } from "child_process";
import { logger } from "./utils";
import { argv } from "yargs";

export function main() {

    const pkg = require(path.join(__dirname, "..", "package.json"));

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on("SIGINT", () => {
        process.exit(0);
    });

    if (!argv["ci"]) {
        const slimPath = path.join(os.homedir(), ".slim");
        const metadataPath = path.join(slimPath, ".metadata.json");
        let slimMetadata;

        if (!fs.existsSync(slimPath)) {
            fs.mkdirSync(slimPath);
            slimMetadata = {};
        } else {
            if (fs.existsSync(metadataPath)) {
                slimMetadata = require(metadataPath);
            } else {
                slimMetadata = {};
            }
        }

        if (!slimMetadata.lastVersionUpdateCheck || new Date().getTime() - new Date(slimMetadata.lastVersionUpdateCheck).getTime() > 1000 * 60 * 60 * 24) {
            checkForUpdate(pkg, metadataPath, slimMetadata);
        }
    }

    yargs
        .locale("en")
        .version(pkg.version)
        .usage("Usage: $0 <command> [options]")
        .command(newCommand)
        .command(devCommand)
        .command(buildCommand)
        .command(testCommand)
        .command(e2eCommand)
        .command(docCommand)
        .command(releaseCommand)
        .command(publishCommand)
        .alias("h", "help")
        .alias("v", "version")
        .option("environment", {
            alias: "env",
            description: "Use the buildProperties of a different environment from the package.json than defined via NODE_ENV."
        })
        .option("ci", {
            description: "Run slim in a Continuous Integration environment mode. This produces file outputs for tests and reduces logging."
        })
        .demand(1)
        .epilog(`Run ${chalk.bold("$0 <command> --help")} for more information on the specific command.`)
        .help().argv;
}

function checkForUpdate(pkg: any, metadataPath: string, slimMetadata: any) {
    logger.debug("Checking for newer slim version...");
    return getLatestSlimVersion(pkg).then(version => {
        if (pkg.version !== version) {
            console.log("\n");
            logger.info("---------------- UPDATE AVAILABLE! ----------------");
            logger.info(`There is a new version of slim available! Current version: ${pkg.version}. Latest version: ${version}.`);
            logger.info(`Run ${chalk.bold("npm i -g slim-cli")} to update.`);
            console.log("\n");
        }
        slimMetadata.lastVersionUpdateCheck = new Date();
        fs.writeFileSync(metadataPath, JSON.stringify(slimMetadata, null, 4));
    });
}

function getLatestSlimVersion(pkg: any): Promise<string> {
    return new Promise(resolve => {
        const npmCommand = spawn("npm", ["show", pkg.name, "version"]);
        npmCommand.stdout.on("data", (version) => {
            resolve(version.toString().trim());
        });
    });
}