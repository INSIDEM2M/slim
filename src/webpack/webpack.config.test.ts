import { CheckerPlugin } from "awesome-typescript-loader";
import * as path from "path";
import * as webpack from "webpack";
import { argv } from "yargs";
import { SlimConfig } from "../config/slim-typings/slim-config";

const DllReferencePlugin = webpack.DllReferencePlugin;
const NamedModulesPlugin = webpack.NamedModulesPlugin;

export function getTestConfigPartial(config: SlimConfig) {
    const conf: webpack.Configuration = {
        devtool: argv.ci ? "eval" : "inline-source-map",
        stats: "minimal",
        module: {
            rules: [
                {
                    test: /\.js$/,
                    enforce: "pre",
                    use: ["source-map-loader"],
                    exclude: ["node_modules"]
                },
                {
                    test: /\.(js|ts)$/,
                    loader: "istanbul-instrumenter-loader",
                    include: config.sourceDir,
                    exclude: [/\.(e2e|spec)\.ts$/, /node_modules/],
                    options: {
                        esModules: true
                    }
                },
                {
                    test: /test-bundle\.js$/,
                    use: [
                        {
                            loader: "string-replace-loader",
                            query: {
                                search: "SOURCE_DIR",
                                replace: config.sourceDir,
                                flags: "g"
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
                                stripSassImports: true
                            }
                        },
                        "empty-sass-shim-loader"
                    ]
                },
                {
                    test: /\.ts$/,
                    exclude: [/\.e2e\.ts$/],
                    use: [
                        {
                            loader: "awesome-typescript-loader",
                            options: {
                                useTranspileModule: true,
                                transpileOnly: true,
                                silent: true,
                                useCache: true
                            }
                        },
                        "angular2-template-loader?keepUrl=true"
                    ]
                }
            ]
        },
        plugins: [new NamedModulesPlugin(), new CheckerPlugin()]
    };

    if (!argv.ci) {
        conf.plugins.push(
            new DllReferencePlugin({
                context: ".",
                manifest: require(path.join(config.dllDir, "polyfills.dll.json"))
            }),
            new DllReferencePlugin({
                context: ".",
                manifest: require(path.join(config.dllDir, "vendors.dll.json"))
            })
        );
    }

    return conf;
}
