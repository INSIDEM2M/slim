import * as webpack from "webpack";
import * as ProgressBarPlugin from "progress-bar-webpack-plugin";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import { AotPlugin } from "@ngtools/webpack";
import { SlimConfig } from "../config/slim-config/slim-config";

export function getBuildConfigPartial(config: SlimConfig, minify: boolean, aot: boolean, indexPath: string): webpack.Configuration {
    let plugins = [
        new ProgressBarPlugin(),
        new HtmlWebpackPlugin({
            template: indexPath
        })
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
                entryModule: config.angular.appModule
            })
        );
        module.rules.push(
            {
                test: /\.ts$/,
                loader: "@ngtools/webpack",
                exclude: [/\.(spec|e2e|d)\.ts$/]
            }
        );
    } else {
        module.rules.push(
            {
                test: /\.ts$/,
                loaders: [
                    "awesome-typescript-loader",
                    "angular2-template-loader?keepUrl=true"
                ],
                exclude: [/\.(spec|e2e|d)\.ts$/]
            }
        );
    }
    module.rules.push(
        {
            test: /.*\.(gif|png|jpe?g)$/i,
            loaders: [
                "file-loader",
                {
                    loader: "image-webpack-loader",
                    query: {
                        progressive: config.images.minify.progressive,
                        optimizationLevel: config.images.minify.optimizationLevel,
                        interlaced: config.images.minify.interlaced
                    }
                }
            ]
        }
    );
    let conf = {
        plugins,
        module,
        output: {
            path: config.targetDir,
            filename: "[name].[hash].js"
        },
        entry: {
            app: config.typescript.entry,
        },
    };
    return conf;
}