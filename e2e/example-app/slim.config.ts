import * as path from "path";

const config: SlimConfig = {
    sass: {
        includePaths: [
            path.join(__dirname, "src"),
            path.join(__dirname, "node_modules", "ionicons", "dist", "scss")
        ],
        globalStyles: [
            path.join(__dirname, "src", "styles.global.scss")
        ]
    },
    typescript: {
        vendors: [
            "ionic-angular"
        ]
    }
};

export = config;