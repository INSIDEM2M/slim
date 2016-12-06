import * as path from "path";

const config: IM2MConfig = {
    sass: {
        includePaths: [
            path.join(__dirname, "src")
        ],
        globalStyles: [
            path.join(__dirname, "src", "styles.global.scss")
        ]
    }
}

export = config;