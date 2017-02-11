import * as webpack from "webpack";
import * as path from "path";
import { CheckerPlugin } from "awesome-typescript-loader";
import { SlimConfig } from "../config/slim-typings/slim-config";

const DllReferencePlugin = (webpack as any).DllReferencePlugin;
const NamedModulesPlugin = (webpack as any).NamedModulesPlugin;

export function getTestConfigPartial(config: SlimConfig): webpack.Configuration {
    return {
        devtool: "inline-source-map",
        stats: "minimal",
        module: {
            rules: [
                {
                    test: /\.js$/,
                    enforce: "pre",
                    use: [
                        "source-map-loader"
                    ]
                },
                {
                    test: /\.(js|ts)$/, loader: "istanbul-instrumenter-loader",
                    include: config.sourceDir,
                    exclude: [
                        /\.(e2e|spec)\.ts$/,
                        /node_modules/
                    ],
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
        plugins: [
            new DllReferencePlugin({
                context: ".",
                manifest: require(path.join(config.dllDir, "polyfills.dll.json"))
            }),
            new DllReferencePlugin({
                context: ".",
                manifest: require(path.join(config.dllDir, "vendors.dll.json"))
            }),
            new NamedModulesPlugin(),
            new CheckerPlugin()
        ]
    };
}