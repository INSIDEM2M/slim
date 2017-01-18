import * as webpack from "webpack";
import * as path from "path";
import * as CopyWebpackPlugin from "copy-webpack-plugin";
import { SlimConfig } from "../config/slim-config/slim-config";

export function getCommonConfigPartial(indexPath: string, environment: any, config: SlimConfig) {
    let conf: any = {
        resolve: {
            extensions: [".ts", ".js", ".json"],
            modules: [
                path.resolve(process.cwd(), path.join(config.rootDir, "node_modules")),
                path.resolve(__dirname, "../../", "node_modules")
            ]
        },
        resolveLoader: {
            extensions: [".js"],
            modules: [path.resolve(__dirname, "../../", "node_modules")]
        },
        module: {
            rules: [
                {
                    test: /\.style\.scss$/,
                    use: [
                        "raw-loader",
                        "postcss-loader",
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true,
                                includePaths: config.sass.includePaths
                            }
                        }
                    ]
                },
                {
                    test: /\.scss$/,
                    exclude: /\.style\.scss$/,
                    use: [
                        "style-loader",
                        "css-loader?importLoaders=1",
                        "postcss-loader",
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true,
                                includePaths: config.sass.includePaths
                            }
                        }
                    ]
                },
                {
                    test: /\.js$/,
                    loader: "source-map-loader",
                    exclude: [
                        /ionic-angular/
                    ]
                },
                { test: /\.json$/, loader: "json-loader" },
                { test: /\.html/, loader: "raw-loader", exclude: [indexPath] },
                { test: /\.css$/, loader: "raw-loader" },
                {
                    test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                    loader: "url-loader?limit=10000&mimetype=application/font-woff"
                },
                {
                    test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
                    loader: "url-loader?limit=10000&mimetype=application/font-woff"
                },
                {
                    test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                    loader: "url-loader?limit=10000&mimetype=application/octet-stream"
                },
                {
                    test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                    loader: "file-loader"
                },
                {
                    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                    loader: "url-loader?limit=10000&mimetype=image/svg+xml"
                }
            ]
        },
        plugins: [
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