import * as webpack from "webpack";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import * as CopyWebpackPlugin from "copy-webpack-plugin";
import * as path from "path";
import { CheckerPlugin } from "awesome-typescript-loader";
import { DllTagPlugin } from "./plugins/dll-tags.plugin";
import { SlimConfig } from "../config/slim-typings/slim-config";
import { RemoveScriptsPlugin } from "./plugins/remove-scripts.plugin";

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
        devtool: "cheap-module-eval-source-map",
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
            clientLogLevel: "warning"
        },
        module: {
            rules: []
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
        conf.entry.app.unshift("webpack/hot/only-dev-server");
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
                        useTranspileModule: !config.typescript.typecheck,
                        transpileOnly: !config.typescript.typecheck,
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