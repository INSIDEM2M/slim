import * as yargs from "yargs";
import { logger } from "../utils";

export const changelogCommand: yargs.CommandModule = {
    command: "changelog",
    describe: "Create the changelog from the git log.",
    handler: (options: Options) => {
        logger.error("Not yet implemented!");
    }
};