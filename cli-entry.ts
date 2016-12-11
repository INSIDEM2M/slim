require("ts-node").register({
    fast: true,
    disableWarnings: true
});

// Provide a title to the process in `ps`
process.title = "slim";

const cli = require("./cli");

cli.main();