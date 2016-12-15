import * as webpack from "webpack";
import * as ProgressBarPlugin from "progress-bar-webpack-plugin";
import { AotPlugin } from "@ngtools/webpack";
import * as HtmlWebpackPlugin from "html-webpack-plugin";

export function getBuildConfigPartial(indexPath: string, targetDir: string, output: string, entry: string, minify: boolean, aot: boolean, tsconfigPath?: string, appModule?: string): webpack.Configuration {
    let plugins = [
        new HtmlWebpackPlugin({
            template: indexPath
        }),
        new ProgressBarPlugin()
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
                tsConfigPath: tsconfigPath,
                entryModule: appModule
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
        )
    }
    let config = {
        plugins,
        module,
        output: {
            path: targetDir,
            filename: "[name].[hash].js"
        },
        entry: {
            app: entry,
        },
    };
    return config;
}