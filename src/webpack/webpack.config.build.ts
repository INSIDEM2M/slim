import * as webpack from "webpack";
import * as CopyWebpackPlugin from "copy-webpack-plugin";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import SuppressChunksPlugin from "suppress-chunks-webpack-plugin";
import { SlimConfig } from "../config/slim-typings/slim-config";
import { RemoveScriptsPlugin } from "./plugins/remove-scripts.plugin";

export function getBuildConfigPartial(config: SlimConfig, minify: boolean, indexPath: string): webpack.Configuration {
    let plugins = [
        new HtmlWebpackPlugin({
            template: indexPath
        }),
        new CopyWebpackPlugin(config.assets.entries),
        new SuppressChunksPlugin([
            { name: "styles", match: /\.js/ }
        ]),
        new RemoveScriptsPlugin(["styles.js"])
    ];
    if (minify) {
        plugins.push(new webpack.optimize.UglifyJsPlugin((<any>{
            beautify: false,
            comments: false,
            mangle: { screw_ie8: true },
            compress: { screw_ie8: true, warnings: false },
            sourceMap: true
        })));
    }
    let conf = {
        bail: true,
        plugins,
        output: {
            path: config.targetDir,
            filename: "[name].js"
        },
        entry: {
            app: config.typescript.entry,
        },
    };
    return conf;
}