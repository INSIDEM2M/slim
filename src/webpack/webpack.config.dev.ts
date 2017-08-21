import { CheckerPlugin } from "awesome-typescript-loader";
import * as CopyWebpackPlugin from "copy-webpack-plugin";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import * as path from "path";
import * as webpack from "webpack";
import { DllTagPlugin } from "./plugins/dll-tags.plugin";
import { RemoveScriptsPlugin } from "./plugins/remove-scripts.plugin";
import { SlimConfig } from "../config/slim-typings/slim-config";

const DllReferencePlugin = webpack.DllReferencePlugin;
const NamedModulesPlugin = webpack.NamedModulesPlugin;

export function getDevConfigPartial(config: SlimConfig, indexPath: string, aot: boolean, port?: number): webpack.Configuration {
    const conf: webpack.Configuration = {
        output: {
            path: config.targetDir,
            filename: "[name].js"
        },
        entry: {
            app: [
                `webpack-dev-server/client?http://localhost:${port}/`,
                path.join(__dirname, "disable-log.entry.js"),
                config.typescript.entry
            ]
        },
        performance: {
            hints: false
        },
        devtool: "cheap-module-source-map",
        devServer: {
            disableHostCheck: true,
            compress: true,
            port: port,
            historyApiFallback: {
                disableDotRule: true,
            },
            // It suppress error shown in console, so it has to be set to false.
            quiet: false,
            // It suppress everything except error, so it has to be set to false as well
            // to see success build.
            noInfo: false,
            stats: {
                // Config for minimal console.log mess.
                assets: false,
                colors: true,
                version: false,
                hash: false,
                modules: false,
                timings: true,
                chunks: false,
                chunkModules: false
            },
            host: "0.0.0.0",
            watchOptions: {
                aggregateTimeout: 300
            },
            hot: !aot,
            clientLogLevel: "warning",
            overlay: true
        },
        module: {
            rules: [
                {
                    test: /\.scss$/,
                    exclude: /\.style\.scss$/,
                    use: [
                        {
                            loader: "style-loader"
                        },
                        {
                            loader: "cache-loader",
                            options: {
                                cacheDirectory: path.join(config.rootDir, ".awcache")
                            }
                        },
                        {
                            loader: "css-loader",
                            options: {
                                localIdentName: "[name]",
                                sourceMap: true
                            }
                        },
                        {
                            loader: "postcss-loader",
                            options: {
                                config: {
                                    path: path.resolve(__dirname, "..", "config", "postcss.config.js")
                                },
                                sourceMap: true
                            }
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true,
                                includePaths: config.sass.includePaths,
                                outputStyle: config.sass.outputStyle
                            }
                        },
                        "empty-sass-shim-loader"
                    ]
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: indexPath
            }),
            new DllReferencePlugin({
                context: ".",
                manifest: require(path.join(config.dllDir, "polyfills.dll.json"))
            }),
            new DllReferencePlugin({
                context: ".",
                manifest: require(path.join(config.dllDir, "vendors.dll.json"))
            }),
            new DllTagPlugin(["polyfills", "vendors"]),
            new CheckerPlugin(),
            new webpack.HotModuleReplacementPlugin(),
            new CopyWebpackPlugin([
                {
                    from: path.join(config.dllDir, "*.js"),
                    flatten: true
                }
            ]),
            new CopyWebpackPlugin(config.assets.entries),
            new NamedModulesPlugin(),
            new RemoveScriptsPlugin(config.webpack.ignoreScripts)
        ]
    };

    if (!aot) {
        ((conf.entry as webpack.Entry).app as string[]).unshift("webpack/hot/dev-server");
        if ((conf.entry as webpack.Entry).styles && config.sass.globalStyles.length > 0) {
            (conf.entry as webpack.Entry).styles = ["webpack/hot/dev-server"];
        }
        (conf.module as webpack.NewModule).rules.push({
            test: /\.ts$/,
            use: [
                {
                    loader: "@angularclass/hmr-loader",
                    query: {
                        pretty: true,
                        prod: false
                    }
                },
                {
                    loader: "awesome-typescript-loader",
                    options: {
                        useCache: true
                    }
                },
                "angular2-template-loader?keepUrl=true",
                "angular-router-loader"
            ],
            exclude: [/\.(spec|e2e|d)\.ts$/]
        });
    }
    return conf;
}