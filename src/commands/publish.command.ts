import { spawn } from "child_process";
import * as simpleGit from "simple-git";
import * as yargs from "yargs";
import { logger } from "../utils";

export const publishCommand: yargs.CommandModule = {
    command: "publish",
    describe: "Publish the package to the npm registry and the central git repository.",
    handler: (options: Options) => {
        const rootDir = process.cwd();
        const npmPublishCommand = spawn("npm", ["publish"], {
            stdio: "inherit"
        });
        npmPublishCommand.on("exit", exitCode => {
            if (exitCode === 0) {
                logger.info("Published package to the npm registry.");
                simpleGit(rootDir)
                    .push("origin")
                    .pushTags("origin")
                    .then(() => logger.info("Pushed the package to the git repository."))
                    .then(() => process.exit(0));
            } else {
                logger.error("Could not publish package!");
                process.exit(exitCode);
            }
        });
    }
};
