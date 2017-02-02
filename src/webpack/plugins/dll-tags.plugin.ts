/**
 * Plugin to add script tags for the dll libraries to the processed html file.
 */
export class DllTagPlugin {

    constructor(private dllLibs: string[] = []) {

    }

    apply(compiler: any) {
        compiler.plugin("compilation", (compilation) => {
            compilation.plugin("html-webpack-plugin-alter-asset-tags", (htmlPluginData, callback) => {
                if (!htmlPluginData.head) {
                    htmlPluginData.head = [];
                }
                this.dllLibs.forEach(lib => {
                    htmlPluginData.head.push({
                        tagName: "script",
                        closeTag: true,
                        attributes: {
                            src: lib + ".dll.js",
                            type: "text/javascript"
                        }
                    });
                });
                callback(null, htmlPluginData);
            });
        });
    }

}