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

export function main() {

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on("SIGINT", () => {
        process.exit(0);
    });


    yargs
        .locale("en")
        .version(require(path.join(__dirname, "..", "package.json")).version)
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
        .demand(1)
        .epilog(`Run ${chalk.bold("$0 <command> --help")} for more information on the specific command.`)
        .help().argv;

}