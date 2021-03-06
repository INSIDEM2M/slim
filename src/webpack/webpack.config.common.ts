import { PurifyPlugin } from "@angular-devkit/build-optimizer";
import { AotPlugin } from "@ngtools/webpack";
import * as path from "path";
import * as webpack from "webpack";
import { argv } from "yargs";
import { SlimConfig } from "../config/slim-typings/slim-config";

const ProgressPlugin = (webpack as any).ProgressPlugin;

export function getCommonConfigPartial(
    indexPath: string,
    environment: any,
    config: SlimConfig,
    stripSassImports: boolean = false,
    aot: boolean
) {
    const conf: webpack.Configuration = {
        output: {
            devtoolModuleFilenameTemplate: "webpack:///[absolute-resource-path]"
        },
        resolve: {
            symlinks: false,
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
        node: {
            fs: "empty",
            global: true,
            crypto: "empty",
            tls: "empty",
            net: "empty",
            process: true,
            module: false,
            clearImmediate: false,
            setImmediate: false
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
                        {
                            loader: "postcss-loader",
                            options: {
                                config: {
                                    path: path.resolve(__dirname, "..", "config", "postcss.config.js")
                                }
                            }
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                includePaths: config.sass.includePaths,
                                outputStyle: config.sass.outputStyle
                            }
                        },
                        {
                            loader: "strip-sass-imports-loader",
                            options: {
                                importsIgnoredDuringTesting: config.sass.importsIgnoredDuringTesting,
                                stripSassImports
                            }
                        },
                        "empty-sass-shim-loader"
                    ]
                },
                {
                    test: /\.js$/,
                    use: ["source-map-loader"],
                    exclude: config.webpack.ignoreSourceMaps
                },
                {
                    test: /\.html/,
                    exclude: [indexPath],
                    use: ["raw-loader"]
                },
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
            new webpack.DefinePlugin({ environment }),
            new webpack.ContextReplacementPlugin(/ionic-angular(\\|\/)util/, config.sourceDir)
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
                typeChecking: argv["ci"] ? false : config.typescript.typecheck
            })
        );
        conf.plugins.push(new PurifyPlugin());
        (conf.module as webpack.NewModule).rules.push({
            test: /\.ts$/,
            use: ["@ngtools/webpack", "@angular-devkit/build-optimizer/webpack-loader"],
            exclude: [/\.(spec|e2e|d)\.ts$/]
        });
    } else {
        (conf.module as webpack.NewModule).rules.push({
            test: /\.ts$/,
            use: [
                {
                    loader: "awesome-typescript-loader",
                    options: {
                        useTranspileModule: argv["ci"] ? true : !config.typescript.typecheck,
                        transpileOnly: argv["ci"] ? true : !config.typescript.typecheck
                    }
                },
                "angular2-template-loader?keepUrl=true",
                "angular-router-loader?debug=" + (argv["debug"] === true)
            ],
            exclude: [/\.(spec|e2e|d)\.ts$/]
        });
    }
    if (Array.isArray(config.sass.globalStyles) && config.sass.globalStyles.length > 0) {
        conf.entry = {
            app: config.sass.globalStyles
        };
    }

    return conf;
}
