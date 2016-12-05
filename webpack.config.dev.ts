import "ts-node/register";

import * as webpack from "webpack";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import * as CopyWebpackPlugin from "copy-webpack-plugin";
import * as path from "path";


function createConfig(env: any): WebpackConfig {
    return {
        output: {
            path: path.join(__dirname, "www"),
            filename: "app.js"
        },
        entry: {
            app: "./src/bootstrap.ts"
        },
        devtool: "cheap-module-eval-source-map",
        devServer: {
            contentBase: "/",
            compress: true,
            port: 3000,
            historyApiFallback: {
                disableDotRule: true,
            },
            stats: 'minimal',
            host: '0.0.0.0',
            watchOptions: {
                aggregateTimeout: 300
            }
        },
        plugins: [
            new webpack.DllReferencePlugin({
                context: ".",
                manifest: require("./dll/polyfills.dll.json")
            }),
            new webpack.DllReferencePlugin({
                context: ".",
                manifest: require("./dll/vendors.dll.json")
            }),
            new HtmlWebpackPlugin({
                template: "./src/index.dev.html"
            }),
            new webpack.ProgressPlugin(),
            new webpack.NamedModulesPlugin(),
            // Fixes https://github.com/webpack/webpack/issues/196
            new webpack.ContextReplacementPlugin(
                /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
                "./src"
            ),
            new CopyWebpackPlugin([
                {
                    from: "./dll/*.js",
                    flatten: true
                }
            ]),
            new webpack.DefinePlugin({
                environment: {
                    isProduction: false,
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
                        "sass-loader?sourcemap"
                    ]
                },
                {
                    test: /\.js$/,
                    loader: "source-map-loader"
                },
                {
                    test: /\.ts$/,
                    loaders: [
                        "awesome-typescript-loader",
                        "angular2-template-loader?keepUrl=true"
                    ],
                    exclude: [/\.(spec|e2e|d)\.ts$/]
                },
                { test: /\.json$/, loader: "json-loader" },
                { test: /\.html/, loader: "raw-loader", exclude: [path.join(__dirname, "src", "index.dev.html")] },
                { test: /\.css$/, loader: "raw-loader" }
            ]
        }
    }
}

export = createConfig;