#! /usr/bin/env node

import * as cli from "./cli";

// Provide a title to the process in `ps`
process.title = "slim";

cli.main();
