var spawn = require("child_process").spawn;
var path = require("path");

var cwd = process.cwd();

function installExampleProject() {
    return new Promise(function (resolve) {
        spawn("yarn", ["install"], {
            cwd: path.join(cwd, "e2e", "example-project"),
            stdio: "inherit"
        }).on("close", function (code) {
            resolve(code);
        });
    });
}

function buildExampleProject() {
    return new Promise(function (resolve) {
        spawn("yarn", ["run", "build"], {
            cwd: path.join(cwd, "e2e", "example-project"),
            stdio: "inherit"
        }).on("close", function (code) {
            resolve(code);
        });
    });
}

installExampleProject().then(buildExampleProject).then(function (code) {
    process.exit(code);
});