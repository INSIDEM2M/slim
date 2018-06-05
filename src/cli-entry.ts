#! /usr/bin/env node
const path = require("path");

// tslint:disable-next-line:no-var-requires
require("ts-node").register({
    project: path.resolve(__dirname, "..", "tsconfig.json"),
    transpileOnly: true
});

// Provide a title to the process in `ps`
process.title = "slim";

// tslint:disable-next-line:no-var-requires
const cli = require("./cli");

cli.main();
