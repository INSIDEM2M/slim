var spawn = require("child_process").spawn;
var path = require("path");

var cwd = process.cwd();

function runNpmScript(projectName, name) {
    return new Promise(function (resolve) {
        spawn("npm", name.split(" "), {
            cwd: path.join(cwd, "e2e", projectName),
            stdio: "inherit"
        }).on("close", function (code) {
            resolve(code);
        });
    });
}

function installExampleProject(projectName) {
    return runNpmScript(projectName, "install");
}

function testExampleProject(projectName) {
    return runNpmScript(projectName, "run e2e");
}



installExampleProject("example-project")
    .then(() => testExampleProject("example-project"))
    .then(() => installExampleProject("example-app"))
    .then(() => testExampleProject("example-app"))
    .then(function (code) {
        process.exit(code);
    });