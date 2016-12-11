import * as webpack from "webpack";
import * as path from "path";

const DllReferencePlugin = (webpack as any).DllReferencePlugin;
const NamedModulesPlugin = (webpack as any).NamedModulesPlugin;

export function getTestConfigPartial(targetDir: string, sourceDir: string, dllDir: string): webpack.Configuration {
    return {
        entry: {},
        devtool: "inline-source-map",
        module: {
            rules: [
                {
                    test: /\.js$/,
                    enforce: 'pre',
                    loader: 'source-map-loader',
                },
                {
                    test: /\.(js|ts)$/, loader: 'istanbul-instrumenter-loader',
                    enforce: 'post',
                    include: sourceDir,
                    exclude: [
                        /\.(e2e|spec)\.ts$/,
                        /node_modules/
                    ]
                },
                {
                    test: /\.ts$/,
                    exclude: [/\.e2e\.ts$/],
                    use: [
                        {
                            loader: "awesome-typescript-loader",
                            options: {
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
                manifest: require(path.join(dllDir, "polyfills.dll.json"))
            }),
            new DllReferencePlugin({
                context: ".",
                manifest: require(path.join(dllDir, "vendors.dll.json"))
            }),
            new NamedModulesPlugin()
        ]
    }
}