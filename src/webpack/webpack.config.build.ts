import * as CopyWebpackPlugin from "copy-webpack-plugin";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import SuppressChunksPlugin from "suppress-chunks-webpack-plugin";
import * as ExtractTextPlugin from "extract-text-webpack-plugin";
import { SlimConfig } from "../config/slim-typings/slim-config";
import { RemoveScriptsPlugin } from "./plugins/remove-scripts.plugin";
import { argv } from "yargs";
import * as path from "path";
import * as UglifyJsPlugin from "uglifyjs-webpack-plugin";
import * as webpack from "webpack";

export function getBuildConfigPartial(config: SlimConfig, minify: boolean, indexPath: string, skipSourceMaps: boolean): any {
    let plugins: webpack.Plugin[] = [
        new HtmlWebpackPlugin({
            template: indexPath
        }),
        new CopyWebpackPlugin(config.assets.entries),
        new SuppressChunksPlugin([
            { name: "styles", match: /\.js/ }
        ]),
        new RemoveScriptsPlugin(["styles.js"]),
        new ExtractTextPlugin({
            filename: "[name].css",
            allChunks: true
        }),
        new webpack.optimize.ModuleConcatenationPlugin()
    ];
    if (minify) {
        plugins.push(new UglifyJsPlugin(({
            beautify: false,
            comments: false,
            mangle: {
                screw_ie8: true
            },
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
                join_vars: true,
                passes: 2,
                reduce_vars: true
            },
            sourceMap: !skipSourceMaps
        })));
    }
    let conf: any = {
        stats: argv["ci"] && !argv["debug"] ? "errors-only" : "normal",
        devtool: skipSourceMaps ? false : "source-map",
        plugins,
        module: {
            rules: [
                {
                    test: /\.html/,
                    exclude: [indexPath],
                    use: [
                        "raw-loader",
                        {
                            loader: "html-minify-loader",
                            options: {
                                quotes: true,
                                dom: { // options of !(htmlparser2)[https://github.com/fb55/htmlparser2]
                                    lowerCaseAttributeNames: false,
                                }
                            }
                        }
                    ]
                },
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
                                    path: path.relative(__dirname, path.resolve("..", "config", "postcss.config.js")),
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