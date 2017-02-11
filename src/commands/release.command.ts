import * as yargs from "yargs";
import { logger } from "../utils";
import * as path from "path";
import * as semver from "semver";
import * as fs from "fs";
import { DOMParser, XMLSerializer } from "xmldom";
import * as conventionalChangelog from "conventional-changelog";

import * as simpleGit from "simple-git";

function getNextVersion(options: Options, version: string) {
    let nextVersion;
    if (options["use-version"]) {
        if (semver.valid(options["use-version"])) {
            logger.error(options["use-version"] + " is no valid version! Aborting release...");
            process.exit(1);
        } else {
            nextVersion = options["use-version"];
        }
    } else {
        nextVersion = semver.inc(version, options.major ? "major" : options.minor ? "minor" : "patch");
    }
    return nextVersion;
}

function updateConfigXml(configPath: string, version: string) {
    const configXmlFile = fs.readFileSync(configPath, "utf-8");
    const configXmlDom = new DOMParser().parseFromString(configXmlFile, "application/xml");
    const widgetElement = configXmlDom.getElementsByTagName("widget")[0];
    widgetElement.setAttribute("version", version);
    if (widgetElement.hasAttribute("android-versionCode")) {
        widgetElement.setAttribute("android-versionCode", String(Number(widgetElement.getAttribute("android-versionCode")) + 1));
    }
    const serializedConfigXml = new XMLSerializer().serializeToString(configXmlDom);
    fs.writeFileSync(configPath, serializedConfigXml, "utf-8");
    logger.info("Updated config.xml file.");
}

function updateChangelog(rootDir, changelogFileName) {
    const changelogPath = path.join(rootDir, changelogFileName);
    if (!fs.existsSync(changelogPath)) {
        fs.writeFileSync(changelogPath, "", {
            encoding: "utf-8"
        });
    }
    return new Promise((resolve) => {
        const writeStream = fs.createWriteStream(changelogPath, { encoding: "utf-8", autoClose: true });
        conventionalChangelog({
            preset: "angular"
        }).pipe(writeStream);
        writeStream.on("close", () => {
            logger.info(`Updated ${changelogFileName} file.`);
            resolve(0);
        });
    });
}

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
        const rootDir = process.cwd();
        const pkgPath = path.join(rootDir, "package.json");
        const pkg = require(pkgPath);
        const version = pkg.version;
        const nextVersion = getNextVersion(options, version);

        pkg.version = nextVersion;
        fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), "utf-8");
        logger.info("Updated package.json.");

        const changelogFileName = "CHANGELOG.md";

        updateChangelog(rootDir, changelogFileName).then(() => {
            const filesToAdd = ["package.json", changelogFileName];

            const configPath = path.join(rootDir, "config.xml");
            const hasConfigXmlFile = fs.existsSync(configPath);

            if (hasConfigXmlFile) {
                updateConfigXml(configPath, nextVersion);
                filesToAdd.push("config.xml");
            }

            return simpleGit(rootDir)
                .add(filesToAdd)
                .commit(nextVersion)
                .addTag(nextVersion, (error) => {
                    if (error) {
                        process.exit(1);
                    } else {
                        process.exit(0);
                    }
                });
        });
    }
};