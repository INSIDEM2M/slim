import { logger } from '../logger';
import * as yargs from "yargs";
import * as path from "path";
import * as os from "os";

let builder: yargs.CommandBuilder = ((): yargs.CommandBuilder => {

    let templates: yargs.CommandBuilder = {
        "component": {
            alias: "c",
            type: "boolean",
            description: "Create a component project."
        },
        "portal": {
            alias: "p",
            type: "boolean",
            description: "Create a portal project.",
            url: "https://github.com/0xE282B0/slim-test-template"
        },
        "app": {
            alias: "a",
            type: "boolean",
            description: "Create an app project."
        }
    };

    try {
        templates = require(path.join(os.homedir(), ".slim/templates.ts")).templates;
        logger.info(".slim/templates.ts:\n" + JSON.stringify(templates, null, 2));
    } catch (error) {
        logger.info(error);
        //TODO: (0xe282b0) Print more understandable error message (IO/format)
    }

    //TODO: (0xe282b0) check that templates variable is a valid CommandBuilder;
    //TODO: (0xe282b0) check that aliases are unique;

    return templates;
})();

export const newCommand: yargs.CommandModule = {
    command: "new",
    builder,
    handler: (options: Options) => {
        logger.info(options);

        //TODO: (0xe282b0): only if not a single option is selected

        var inquirer = require('inquirer');
        inquirer.prompt(
            [
                {
                    type: 'list',
                    name: 'project.type',
                    message: 'What do you want to create?',
                    choices: Object.keys(builder)
                }
            ]

        ).then(function (answers) {

            let fs = require('fs');

            let targetPath = path.join(os.homedir(), ".slim", answers.project.type);

            var simpleGit = require('simple-git')(targetPath);
            if (fs.existsSync(targetPath)) {

                simpleGit.pull('origin', 'master', { '--rebase': 'true' })
                    .then(() => scaffold(targetPath, process.cwd()), () => { console.log("error") })

                console.log("check if local availabe");
                console.log("pull if availabe");
            } else {
                console.log("clone if not available");
                simpleGit.clone(
                    builder[answers.project.type].url,
                    targetPath)
                    .then(() => scaffold(targetPath, process.cwd()))
            }
        });

    }
};

const scaffold = (source, target) => {
    let _ = require('lodash');
    let fs = require('fs');
    var glob = require("glob")

    let templateConfig = require(path.join(source, "template.ts")).config;



    var inquirer = require('inquirer');
    inquirer.prompt(templateConfig.questions)
        .then((answers) => new Promise((resolve, jeject) => resolve(templateConfig.mapper(answers))))
        .then(answers => new Promise((resolve, reject) => {

            glob("**", { cwd: source, ignore: templateConfig.include }, function (er, files) {
                for (let f of files) {
                    console.log(f);
                    fs.createReadStream(path.join(source, f)).pipe(fs.createWriteStream(path.join(target, f)));
                }

                glob(templateConfig.include, { cwd: source }, function (er, files) {

                    for (let f of files) {
                        console.log(f);
                        fs.writeFile(path.join(target, f),
                            _.template(fs.readFileSync(path.join(source, f), { 'encoding': 'utf8' }))(answers),
                            function (err) {
                                if (err) {
                                    return console.log(err);
                                }

                                console.log("The file was saved!");

                            });
                    }

                    resolve(0);
                });
            });
        }))

    console.log("Read template.js");
    console.log("Check if description is complete");
    console.log("run before scaffolding script (check deps)");
    console.log("ask questions");
    console.log("replace placeholders");
    console.log("run after scaffolding script");
}