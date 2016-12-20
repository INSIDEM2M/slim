import * as yargs from "yargs";
import { logger } from "../logger";

export const newCommand: yargs.CommandModule = {
    command: "new",
    builder: {
        "component": {
            alias: "c",
            type: "boolean",
            description: "Create a component project."
        },
        "portal": {
            alias: "p",
            type: "boolean",
            description: "Create a portal project."
        },
        "app": {
            alias: "a",
            type: "boolean",
            description: "Create an app project."
        }
    },
    handler: (options: Options) => {
        logger.error("Not yet implemented!");
    }
}