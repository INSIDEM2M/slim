import "ts-node/register";

import * as webpack from "webpack";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import * as CopyWebpackPlugin from "copy-webpack-plugin";
import * as path from "path";
import { AotPlugin } from "@ngtools/webpack";

function createConfig(env: any): WebpackConfig {
    return {
        output: {
            path: path.join(__dirname, "www"),
            filename: "app.js"
        },
        entry: {
            app: "./src/bootstrap.ts"
        },
        plugins: [
            new AotPlugin({
                tsConfigPath: "./tsconfig.json",
                entryModule: "./src/app/app.module#AppModule"
            }),
            new webpack.optimize.UglifyJsPlugin({
                beautify: false,
                comments: false
            }),
            new HtmlWebpackPlugin({
                template: "./src/index.html"
            }),
            new webpack.ProgressPlugin(),
            new webpack.NamedModulesPlugin(),
            // Fixes https://github.com/webpack/webpack/issues/196
            new webpack.ContextReplacementPlugin(
                /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
                "./src"
            ),
            new webpack.DefinePlugin({
                environment: {
                    isProduction: true,
                    buildDate: new Date()
                }
            })
        ],
        resolve: {
            extensions: [".ts", ".js", ".json"]
        },
        module: {
            rules: [
                {
                    test: /\.scss$/,
                    loaders: [
                        "raw-loader",
                        "sass-loader"
                    ]
                },
                {
                    test: /\.ts$/,
                    loader: "@ngtools/webpack",
                    exclude: [/\.(spec|e2e|d)\.ts$/]
                },
                { test: /\.json$/, loader: "json-loader" },
                { test: /\.html/, loader: "raw-loader" },
                { test: /\.css$/, loader: "raw-loader" }
            ]
        }
    }
}

export = createConfig;