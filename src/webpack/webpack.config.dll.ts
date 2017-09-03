import * as path from "path";
import * as ProgressBarPlugin from "progress-bar-webpack-plugin";
import * as webpack from "webpack";
import { POLYFILLS } from "./webpack.polyfills";
import { VENDORS } from "./webpack.vendors";

const DllPlugin = webpack.DllPlugin;

export function getDllConfigPartial(dllDir: string): webpack.Configuration {
    return {
        entry: {
            vendors: VENDORS,
            polyfills: POLYFILLS
        },
        output: {
            path: dllDir,
            filename: "[name].dll.js",
            library: "[name]"
        },
        devtool: "eval",
        plugins: [
            new DllPlugin({
                name: "[name]",
                path: path.join(dllDir, "[name].dll.json")
            }),
            new ProgressBarPlugin()
        ]
    };
}
