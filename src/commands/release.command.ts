import * as yargs from "yargs";
import { logger } from "../logger";

export const releaseCommand: yargs.CommandModule = {
    command: "release",
    describe: "Perform a release. Update the version in the package.json and in an cordova project aswell in the config.xml.",
    builder: {
        "patch": {
            description: "Perform a patch release.",
            type: "boolean"
        },
        "minor": {
            description: "Perform a minor release.",
            type: "boolean"
        },
        "major": {
            description: "Perform a major release.",
            type: "boolean"
        },
        "use-version": {
            description: "Release the given version.",
            type: "string"
        }
    },
    handler: (options: Options) => {
        logger.error("Not yet implemented!");
    }
}