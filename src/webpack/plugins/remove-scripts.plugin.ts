import { logger } from "../../utils";
/**
 * Plugin to remove script tags with specific `src` attributes
 * from the processed html files.
 *
 * One example is the `cordova.js` file
 * that is only available in a Cordova environment and can be
 * ignored during development in the browser.
 */
export class RemoveScriptsPlugin {
    constructor(private scripts: string[] = []) {}

    apply(compiler: any) {
        compiler.plugin("compilation", compilation => {
            compilation.plugin("html-webpack-plugin-before-html-processing", (htmlPluginData, callback) => {
                for (const script of this.scripts) {
                    const regex = new RegExp('<script.+src="' + script + '".*?</script>');
                    if (regex.test(htmlPluginData.html)) {
                        htmlPluginData.html = htmlPluginData.html.replace(regex, "");
                        logger.debug(`Removed ${script} from index.html.`);
                    }
                }
                callback(null, htmlPluginData);
            });

            compilation.plugin("html-webpack-plugin-alter-asset-tags", (htmlPluginData, callback) => {
                if (htmlPluginData.body && Array.isArray(htmlPluginData.body)) {
                    htmlPluginData.body = htmlPluginData.body.filter(asset => {
                        for (const script of this.scripts) {
                            const regex = new RegExp(script);
                            if (asset.attributes && typeof asset.attributes.src === "string") {
                                if (regex.test(asset.attributes.src)) {
                                    logger.debug(`Removed ${script} from index.html.`);
                                    return false;
                                }
                            }
                        }
                        return true;
                    });
                }
                callback(null, htmlPluginData);
            });
        });
    }
}
