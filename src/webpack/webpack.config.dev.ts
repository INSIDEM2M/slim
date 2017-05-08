import { CheckerPlugin } from "awesome-typescript-loader";
import * as CopyWebpackPlugin from "copy-webpack-plugin";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import * as path from "path";
import * as webpack from "webpack";
import { DllTagPlugin } from "./plugins/dll-tags.plugin";
import { RemoveScriptsPlugin } from "./plugins/remove-scripts.plugin";
import { SlimConfig } from "../config/slim-typings/slim-config";

const DllReferencePlugin = (webpack as any).DllReferencePlugin;
const NamedModulesPlugin = (webpack as any).NamedModulesPlugin;

export function getDevConfigPartial(config: SlimConfig, indexPath: string, aot: boolean, port?: number): webpack.Configuration {
    const conf: any = {
        output: {
            path: config.targetDir,
            filename: "[name].js"
        },
        entry: {
            app: [
                `webpack-dev-server/client?http://localhost:${port}/`,
                config.typescript.entry
            ]
        },
        performance: {
            hints: false
        },
        devtool: "cheap-module-source-map",
        devServer: {
            compress: true,
            port: port,
            historyApiFallback: {
                disableDotRule: true,
            },
            stats: "minimal",
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
                            loader: "vue-style-loader"
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
        conf.entry.app.unshift("webpack/hot/dev-server");
        if (conf.entry.styles && config.sass.globalStyles.length > 0) {
            conf.entry.styles = ["webpack/hot/dev-server"];
        }
        conf.module.rules.push({
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