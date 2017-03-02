import * as webpack from "webpack";
import * as CopyWebpackPlugin from "copy-webpack-plugin";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import SuppressChunksPlugin from "suppress-chunks-webpack-plugin";
import * as ExtractTextPlugin from "extract-text-webpack-plugin";
import { SlimConfig } from "../config/slim-typings/slim-config";
import { RemoveScriptsPlugin } from "./plugins/remove-scripts.plugin";
import { argv } from "yargs";
import * as path from "path";

export function getBuildConfigPartial(config: SlimConfig, minify: boolean, indexPath: string, skipSourceMaps: boolean): any {
    let plugins = [
        new HtmlWebpackPlugin({
            template: indexPath
        }),
        new CopyWebpackPlugin(config.assets.entries),
        new SuppressChunksPlugin([
            { name: "styles", match: /\.js/ }
        ]),
        new RemoveScriptsPlugin(["styles.js"]),
        new ExtractTextPlugin("styles.css")
    ];
    if (minify) {
        plugins.push(new webpack.optimize.UglifyJsPlugin((<any>{
            beautify: false,
            comments: false,
            mangle: { screw_ie8: true },
            compress: {
                screw_ie8: true,
                warnings: argv["debug"],
                sequences: true,
                dead_code: true,
                conditionals: true,
                comparisons: true,
                drop_debugger: true,
                evaluate: true,
                loops: true,
                booleans: true,
                unused: true,
                if_return: true,
                join_vars: true
            },
            sourceMap: true
        })));
    }
    let conf: any = {
        bail: true,
        stats: argv["ci"] ? "errors-only" : "minimal",
        devtool: skipSourceMaps ? false : "source-map",
        plugins,
        module: {
            rules: [
                {
                    test: /\.scss$/,
                    exclude: /\.style\.scss$/,
                    use: ExtractTextPlugin.extract({
                        use: [
                            {
                                loader: "css-loader",
                                options: {
                                    importLoaders: 1,
                                    localIdentName: "[name]"
                                }
                            },
                            {
                                loader: "postcss-loader",
                                options: {
                                    config: path.resolve(__dirname, "..", "config")
                                }
                            },
                            {
                                loader: "sass-loader",
                                options: {
                                    sourceMap: false,
                                    includePaths: config.sass.includePaths,
                                    outputStyle: config.sass.outputStyle
                                }
                            },
                            "empty-sass-shim-loader"
                        ]
                    })
                },
            ]
        },
        output: {
            path: config.targetDir,
            filename: "[name].js"
        },
        entry: {
            app: config.typescript.entry,
        },
    };
    if (Array.isArray(config.sass.globalStyles) && config.sass.globalStyles.length > 0) {
        conf.entry.styles = config.sass.globalStyles;
    }
    return conf;
}