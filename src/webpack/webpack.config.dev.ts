import * as webpack from "webpack";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import * as CopyWebpackPlugin from "copy-webpack-plugin";
import * as path from "path";
import { CheckerPlugin } from "awesome-typescript-loader";
import { DllTagPlugin } from "./plugins/dll-tags.plugin";
import { SlimConfig } from "../config/slim-config/slim-config";

const DllReferencePlugin = (webpack as any).DllReferencePlugin;
const NamedModulesPlugin = (webpack as any).NamedModulesPlugin;

export function getDevConfigPartial(config: SlimConfig, indexPath: string, port?: number): webpack.Configuration {
    const conf: any = {
        output: {
            path: config.targetDir,
            filename: "[name].[hash].js"
        },
        entry: {
            app: [
                `webpack-dev-server/client?http://localhost:${port}/`,
                "webpack/hot/only-dev-server",
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
            hot: true,
            clientLogLevel: "warning"
        },
        module: {
            rules: [
                {
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
                                useTranspileModule: true,
                                transpileOnly: true,
                                useCache: true
                            }
                        },
                        "angular2-template-loader?keepUrl=true"
                    ],
                    exclude: [/\.(spec|e2e|d)\.ts$/]
                },
                {
                    test: /.*\.(gif|png|jpe?g|svg)$/i,
                    loader: "file-loader"
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
            new DllTagPlugin(["vendors", "polyfills"]),
            new CheckerPlugin(),
            new webpack.HotModuleReplacementPlugin(),
            new CopyWebpackPlugin([
                {
                    from: path.join(config.dllDir, "*.js"),
                    flatten: true
                }
            ]),
            new NamedModulesPlugin(),
        ]
    };
    return conf;
}