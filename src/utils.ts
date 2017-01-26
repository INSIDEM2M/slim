import * as tracer from "tracer";
import * as chalk from "chalk";
import { argv } from "yargs";

export const logger = tracer.colorConsole({
    format: `[${chalk.grey("{{timestamp}}")}] [{{title}}] "{{message}}"}`,
    dateformat: "HH:MM:ss",
    level: argv["debug"] ? "debug" : argv["trace"] ? "trace" : "info"
});

class Timer {

    private timers: { [name: string]: Date } = {};

    start(name: string) {
        this.timers[name] = new Date();
    }

    end(name: string, level: string = "info") {
        const elapsedTime = new Date().getTime() - this.timers[name].getTime();
        logger[level](`${name} took ${elapsedTime / 1000}s`);
    }
}

export const timer = new Timer(); 