import * as path from "path";

const config: SlimConfig = {
    sass: {
        includePaths: [
            path.join(__dirname, "src")
        ],
        globalStyles: [
            path.join(__dirname, "src", "styles.global.scss")
        ]
    }
};

export = config;