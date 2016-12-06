import * as tracer from "tracer";
import * as chalk from "chalk";
import { argv } from "yargs";

export const logger = tracer.colorConsole({
    format: `[${chalk.grey("{{timestamp}}")}] [{{title}}] ${chalk.black("{{message}}")}`,
    dateformat: "HH:MM:ss",
    level: argv["debug"] ? "debug" : argv["trace"] ? "trace" : "info"
});