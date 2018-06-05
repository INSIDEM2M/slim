#! /usr/bin/env node

// tslint:disable-next-line:no-var-requires
require("ts-node").register({
    skipProject: true
});

// Provide a title to the process in `ps`
process.title = "slim";

// tslint:disable-next-line:no-var-requires
const cli = require("./cli");

cli.main();
