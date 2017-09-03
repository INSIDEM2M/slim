import * as chalk from "chalk";
import * as path from "path";
import * as readline from "readline";
import * as yargs from "yargs";
import { buildCommand } from "./commands/build.command";
import { devCommand } from "./commands/dev.command";
import { docCommand } from "./commands/doc.command";
import { e2eCommand } from "./commands/e2e.command";
import { publishCommand } from "./commands/publish.command";
import { releaseCommand } from "./commands/release.command";
import { testCommand } from "./commands/test.command";

export function main() {
    const pkg = require(path.join(__dirname, "..", "package.json"));

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on("SIGINT", () => {
        process.exit(0);
    });

    // tslint:disable-next-line:no-unused-expression
    yargs
        .locale("en")
        .version(pkg.version)
        .usage("Usage: $0 <command> [options]")
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
