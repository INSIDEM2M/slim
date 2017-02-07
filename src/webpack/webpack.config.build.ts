import * as webpack from "webpack";
import * as CopyWebpackPlugin from "copy-webpack-plugin";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import { AotPlugin } from "@ngtools/webpack";
import { SlimConfig } from "../config/slim-typings/slim-config";

export function getBuildConfigPartial(config: SlimConfig, minify: boolean, aot: boolean, indexPath: string): webpack.Configuration {
    let plugins = [
        new HtmlWebpackPlugin({
            template: indexPath
        }),
        new CopyWebpackPlugin(config.assets.entries)
    ];
    let module = {
        rules: []
    };
    if (minify) {
        plugins.push(new webpack.optimize.UglifyJsPlugin((<any>{
            beautify: false,
            comments: false,
            mangle: { screw_ie8: true },
            compress: { screw_ie8: true, warnings: false },
            sourceMap: true
        })));
    }
    if (aot) {
        plugins.push(
            new AotPlugin({
                tsConfigPath: config.angular.aotTsConfig,
                entryModule: config.angular.appModule,
                typeChecking: config.typescript.typecheck
            })
        );
        module.rules.push(
            {
                test: /\.ts$/,
                loaders: [
                    "@ngtools/webpack",
                    {
                        loader: "angular-router-loader",
                        options: {
                            aot: true
                        }
                    }
                ],
                exclude: [/\.(spec|e2e|d)\.ts$/]
            }
        );
    } else {
        module.rules.push(
            {
                test: /\.ts$/,
                loaders: [
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
    let conf = {
        bail: true,
        plugins,
        module,
        output: {
            path: config.targetDir,
            filename: "[name].js"
        },
        entry: {
            app: config.typescript.entry,
        },
    };
    return conf;
}