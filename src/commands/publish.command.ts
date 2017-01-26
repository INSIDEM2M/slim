import * as yargs from "yargs";
import { logger } from "../utils";

export const publishCommand: yargs.CommandModule = {
    command: "publish",
    describe: "Publish the package to the npm registry and the central git repository.",
    handler: (options: Options) => {
        logger.error("Not yet implemented!");
    }
};