require("ts-node").register({
    fast: true,
    disableWarnings: true
});

const cli = require("./cli");

cli.main();