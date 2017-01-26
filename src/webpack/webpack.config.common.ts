import * as webpack from "webpack";
import * as path from "path";
import * as CopyWebpackPlugin from "copy-webpack-plugin";
import { SlimConfig } from "../config/slim-config/slim-config";

const ProgressPlugin = (webpack as any).ProgressPlugin;

export function getCommonConfigPartial(indexPath: string, environment: any, config: SlimConfig, stripSassImports: boolean = false) {
    let conf: any = {
        resolve: {
            extensions: [".ts", ".js", ".json"],
            modules: [
                path.resolve(process.cwd(), path.join(config.rootDir, "node_modules")),
                path.resolve(__dirname, "..", "..", "node_modules")
            ]
        },
        resolveLoader: {
            extensions: [".js", ".ts"],
            modules: [path.resolve(__dirname, "../../", "node_modules"), path.join(__dirname, "loaders")]
        },
        module: {
            noParse: [
                // This is needed because otherwise all moment locales will be included in the build.
                // Now the locales have to be imported explicitly.
                /moment.js/
            ],
            rules: [
                {
                    test: /\.style\.scss$/,
                    use: [
                        "raw-loader",
                        {
                            loader: "postcss-loader",
                            options: {
                                config: path.resolve(__dirname, "..", "config")
                            }
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true,
                                includePaths: config.sass.includePaths
                            }
                        },
                        {
                            loader: "strip-sass-imports-loader",
                            options: {
                                importsIgnoredDuringTesting: config.sass.importsIgnoredDuringTesting,
                                stripSassImports: stripSassImports
                            }
                        }
                    ]
                },
                {
                    test: /\.scss$/,
                    exclude: /\.style\.scss$/,
                    use: [
                        "style-loader",
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
                                sourceMap: true,
                                includePaths: config.sass.includePaths
                            }
                        },
                        {
                            loader: "strip-sass-imports-loader",
                            options: {
                                importsIgnoredDuringTesting: config.sass.importsIgnoredDuringTesting,
                                stripSassImports: stripSassImports
                            }
                        }
                    ]
                },
                {
                    test: /\.js$/,
                    loader: "source-map-loader",
                    exclude: config.webpack.ignoreSourceMaps
                },
                { test: /\.html/, loader: "raw-loader", exclude: [indexPath] },
                { test: /\.css$/, loader: "raw-loader" },
                {
                    test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                    loader: "url-loader?limit=10000&mimetype=application/font-woff&name=[name].[ext]"
                },
                {
                    test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
                    loader: "url-loader?limit=10000&mimetype=application/font-woff&name=[name].[ext]"
                },
                {
                    test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                    loader: "url-loader?limit=10000&mimetype=application/octet-stream&name=[name].[ext]"
                },
                {
                    test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                    loader: "file-loader?name=[name].[ext]"
                },
                {
                    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                    loader: "url-loader?limit=10000&mimetype=image/svg+xml&name=[name].[ext]"
                }
            ]
        },
        plugins: [
            new ProgressPlugin(),
            // Fixes https://github.com/webpack/webpack/issues/196
            new webpack.ContextReplacementPlugin(
                /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
                "./src"
            ),
            new webpack.DefinePlugin({ environment }),
            new CopyWebpackPlugin(config.extras.entries.map(extra => {
                return {
                    from: extra,
                    flatten: config.extras.flatten
                };
            }))
        ]
    };

    if (Array.isArray(config.sass.globalStyles) && config.sass.globalStyles.length > 0) {
        conf.entry = {
            styles: config.sass.globalStyles
        };
    }

    return conf;
}