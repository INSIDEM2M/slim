import "ts-node/register";

import * as webpack from "webpack";
import * as HtmlWebpackPlugin from "html-webpack-plugin";

const VENDORS = require("./webpack.vendors");
const POLYFILLS = require("./webpack.polyfills");

function createConfig(env: any): WebpackConfig {

    return {
        entry: {
            vendors: VENDORS,
            polyfills: POLYFILLS
        },
        output: {
            path: "./dll",
            filename: "[name].dll.js",
            library: "[name]"
        },
        devtool: "eval",
        plugins: [
            new webpack.NamedModulesPlugin(),
            // Fixes https://github.com/webpack/webpack/issues/196
            new webpack.ContextReplacementPlugin(
                /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
                "./src"
            ),
            new webpack.DllPlugin({
                name: "[name]",
                path: "./dll/[name].dll.json"
            })
        ],
        resolve: {
            extensions: [".ts", ".js", ".json"]
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: "source-map-loader"
                },
                {
                    test: /\.ts$/,
                    loaders: [
                        "awesome-typescript-loader",
                        "angular2-template-loader"
                    ],
                    exclude: [/\.(spec|e2e|d)\.ts$/]
                },
            ]
        }
    }
}

export = createConfig;