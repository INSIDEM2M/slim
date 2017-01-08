import { logger } from '../logger';
import * as yargs from "yargs";
import * as path from "path";
import * as os from "os";

function getTemplates(): yargs.CommandBuilder {
    
    let templates: yargs.CommandBuilder = {
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
    };

    try {
        templates = require(path.join(os.homedir(),".slim/templates.ts")).templates;
        logger.info(".slim/templates.ts:\n" + JSON.stringify(templates, null, 2));
    } catch (error) {
        logger.info(error);
        //TODO: (0xe282b0) Print more understandable error message (IO/format)
    }

    //TODO: (0xe282b0) check that templates variable is a valid CommandBuilder;
    //TODO: (0xe282b0) check that aliases are unique;
   
    return templates;
}


let builder: yargs.CommandBuilder = getTemplates();

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

            let nodegit = require("nodegit");
            let os = require("os");
            console.log("check if local availabe");
            console.log("pull if availabe");
            console.log("clone if not available");

            let targetPath = path.join(os.homedir(), ".slim", answers.project.type);
            return nodegit.Clone(
                builder[answers.project.type].url,
                targetPath,
                {
                    fetchOpts: {
                        callbacks: {
                            certificateCheck: function () {
                                // github will fail cert check on some OSX machines
                                // this overrides that check
                                return 1;
                            }
                        }
                    }
                })
        }).then(function (answers) {
            return new Promise((ok, reject) => {
                // console.log(JSON.stringify(builder[answers.project.type], null, '  '));
                console.log("Read template.js");
                console.log("Check if description is complete");
                console.log("run before scaffolding script (check deps)");
                console.log("ask questions");
                console.log("replace placeholders");
                console.log("run after scaffolding script");

                ok(0);
            })
        }).then(function (code) {
            process.exit(code);
        });


    }
};