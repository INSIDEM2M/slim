import { spawn } from "child_process";
import * as fs from "fs";
import * as glob from "glob";
import * as path from "path";
import * as sassDoc from "sassdoc";
import { argv } from "yargs";
import { SlimConfig } from "../config/slim-typings/slim-config";
import { logger } from "../utils";

module.exports = function(env: Environment, config: SlimConfig) {
    logger.info("Creating documentation...");
    const args = [
        "--tsconfig",
        "tsconfig.json",
        "--hideGenerator",
        "--disableGraph",
        "--output",
        "docs",
        "--toggleMenuItems",
        "components,directives,injectables,interfaces,pipes,classes",
        "--disablePrivateOrInternalSupport"
    ];
    if (!argv.debug) {
        args.push("--silent");
    }
    const docProcess = spawn(getCompodocBinaryPath(), args, {
        cwd: config.rootDir,
        stdio: "inherit"
    });
    return createSassDocumentation(config).then(() => {
        return new Promise(resolve => {
            docProcess.on("exit", exitCode => {
                resolve(exitCode);
            });
        });
    });
};

function getCompodocBinaryPath() {
    return path.resolve(__dirname, "..", "..", "node_modules", ".bin", "compodoc");
}

function createSassDocumentation(config: SlimConfig): Promise<any> {
    const components = glob.sync(path.join(config.sourceDir, "**", "*.style.scss"));
    return sassDoc.parse(components).then(sassData => {
        const files = sassData.reduce((prev, curr) => {
            if (!(prev as any).hasOwnProperty(curr.file.path)) {
                prev[curr.file.path] = {
                    docs: []
                };
            }
            prev[curr.file.path].docs.push(curr);
            return prev;
        }, {}) as { [path: string]: { docs: ParseResult[] } };
        Object.keys(files).forEach(file => {
            const componentPath = glob.sync(path.join(config.sourceDir, "**", file));
            if (componentPath.length === 1) {
                const readmePath = componentPath[0].replace(".style.scss", ".component.md");
                let readmeContent = "# Sass variables\n\n";
                files[file].docs.forEach(doc => {
                    readmeContent += `- **$${doc.context.name}**: <code>${doc.context.value.replace("\n", " ")}</code>\n\n`;
                    readmeContent += `\t${doc.description}\n\n`;
                });
                fs.writeFileSync(readmePath, readmeContent, { encoding: "utf8" });
            }
        });
    });
}
