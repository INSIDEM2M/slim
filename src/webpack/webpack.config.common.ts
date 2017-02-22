import * as webpack from "webpack";
import * as path from "path";
import { SlimConfig } from "../config/slim-typings/slim-config";
import { AotPlugin } from "@ngtools/webpack";
import { argv } from "yargs";

const ProgressPlugin = (webpack as any).ProgressPlugin;

export function getCommonConfigPartial(indexPath: string, environment: any, config: SlimConfig, stripSassImports: boolean = false, aot: boolean) {
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
                                sourceMap: false,
                                includePaths: config.sass.includePaths,
                                outputStyle: config.sass.outputStyle
                            }
                        },
                        {
                            loader: "strip-sass-imports-loader",
                            options: {
                                importsIgnoredDuringTesting: config.sass.importsIgnoredDuringTesting,
                                stripSassImports: stripSassImports
                            }
                        },
                        "empty-sass-shim-loader"
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
                    test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                    loader: "url-loader",
                    options: {
                        limit: 10000,
                        mimetype: "application/font-woff",
                        name: "[name].[ext]"
                    }
                },
                {
                    test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                    loader: "url-loader",
                    options: {
                        limit: 10000,
                        mimetype: "application/octet-stream",
                        name: "[name].[ext]"
                    }
                },
                {
                    test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                    loader: "file-loader",
                    options: {
                        name: "[name].[ext]"
                    }
                },
                {
                    test: /\.(png|jpg|jpeg)$/,
                    loader: "file-loader",
                    options: {
                        name: "[name].[ext]"
                    }
                },
                {
                    test: /\.svg$/,
                    use: [
                        {
                            loader: "svg-url-loader",
                            options: {
                                limit: 10000,
                                name: "[name].[ext]"
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new webpack.DefinePlugin({ environment })
        ]
    };

    if (!argv["ci"]) {
        conf.plugins.push(new ProgressPlugin());
    }

    if (aot) {
        conf.plugins.push(
            new AotPlugin({
                tsConfigPath: config.angular.aotTsConfig,
                entryModule: config.angular.appModule,
                typeChecking: config.typescript.typecheck
            })
        );
        conf.module.rules.push(
            {
                test: /\.ts$/,
                loader: "@ngtools/webpack",
                exclude: [/\.(spec|e2e|d)\.ts$/]
            }
        );
    } else {
        conf.module.rules.push(
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: "awesome-typescript-loader",
                        options: {
                            transpileOnly: !config.typescript.typecheck,
                            useTranspileModule: !config.typescript.typecheck
                        }
                    },
                    "angular2-template-loader?keepUrl=true",
                    "angular-router-loader"
                ],
                exclude: [/\.(spec|e2e|d)\.ts$/]
            }
        );
    }
    if (Array.isArray(config.sass.globalStyles) && config.sass.globalStyles.length > 0) {
        conf.entry = {
            styles: config.sass.globalStyles
        };
    }

    return conf;
}