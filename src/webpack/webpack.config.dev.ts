import * as webpack from "webpack";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import * as ProgressBarPlugin from "progress-bar-webpack-plugin";
import * as CopyWebpackPlugin from "copy-webpack-plugin";
import * as path from "path";
import { CheckerPlugin } from "awesome-typescript-loader";
import { DllTagPlugin } from "./plugins/dll-tags.plugin";

const DllReferencePlugin = (webpack as any).DllReferencePlugin;
const NamedModulesPlugin = (webpack as any).NamedModulesPlugin;

export function getDevConfigPartial(targetDir: string, dllDir: string, publicDir: string, output: string, entry: string, port?: number): webpack.Configuration {
    const config: any = {
        output: {
            path: targetDir,
            filename: "[name].[hash].js"
        },
        entry: {
            app: [entry]
        },
        performance: {
            hints: false
        },
        devtool: "cheap-module-eval-source-map",
        devServer: {
            contentBase: publicDir,
            compress: true,
            port: port,
            historyApiFallback: {
                disableDotRule: true,
            },
            stats: 'minimal',
            host: '0.0.0.0',
            watchOptions: {
                aggregateTimeout: 300,
                poll: 1000
            }
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: [
                        {
                            loader: "awesome-typescript-loader",
                            options: {
                                useTranspileModule: true,
                                useCache: true
                            }
                        },
                        "angular2-template-loader?keepUrl=true"
                    ],
                    exclude: [/\.(spec|e2e|d)\.ts$/]
                }
            ]
        },
        plugins: [
            new DllReferencePlugin({
                context: ".",
                manifest: require(path.join(dllDir, "polyfills.dll.json"))
            }),
            new DllReferencePlugin({
                context: ".",
                manifest: require(path.join(dllDir, "vendors.dll.json"))
            }),
            new DllTagPlugin(["vendors", "polyfills"]),
            new CheckerPlugin(),
            new CopyWebpackPlugin([
                {
                    from: path.join(dllDir, "*.js"),
                    flatten: true
                }
            ]),
            new ProgressBarPlugin(),
            new NamedModulesPlugin(),
        ]
    }
    return config;
}