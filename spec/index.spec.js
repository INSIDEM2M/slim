var spawn = require("child_process").spawn;
var path = require("path");

var cwd = process.cwd();

function installExampleProject(projectName) {
    return new Promise(function (resolve) {
        spawn("yarn", ["install"], {
            cwd: path.join(cwd, "e2e", projectName),
            stdio: "inherit"
        }).on("close", function (code) {
            resolve(code);
        });
    });
}

function testExampleProject(projectName) {
    return new Promise(function (resolve) {
        spawn("yarn", ["run", "e2e"], {
            cwd: path.join(cwd, "e2e", projectName),
            stdio: "inherit"
        }).on("close", function (code) {
            resolve(code);
        });

    });
}



installExampleProject("example-project")
    .then(() => testExampleProject("example-project"))
    .then(() => installExampleProject("example-app"))
    .then(() => testExampleProject("example-app"))
    .then(function (code) {
        process.exit(code);
    });