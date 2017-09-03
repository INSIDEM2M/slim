import * as loaderUtils from "loader-utils";
import { logger } from "../../utils";

export interface StripSassImportsLoaderQuery {
    importsIgnoredDuringTesting: string[];
    stripSassImports: boolean;
}

/**
 * This loader is needed to remove imports to non-existing sass files
 * during testing.
 */
module.exports = function(content: Buffer) {
    const query: StripSassImportsLoaderQuery =
        typeof loaderUtils.getOptions === "function" ? loaderUtils.getOptions(this) : loaderUtils.parseQuery(this.query);
    if (query.stripSassImports) {
        if (
            query.importsIgnoredDuringTesting &&
            Array.isArray(query.importsIgnoredDuringTesting) &&
            query.importsIgnoredDuringTesting.length > 0
        ) {
            let sassContent = content.toString();
            for (const ignoredImport of query.importsIgnoredDuringTesting) {
                const regex = new RegExp(`@import\\s['|"].*${ignoredImport}.*['|"];`);
                if (regex.test(sassContent)) {
                    sassContent = sassContent.replace(regex, "");
                    logger.debug(`[strip-sass-imports-loader] Ignored import of ${ignoredImport} in ${this.resourcePath}.`);
                }
            }
            return sassContent;
        }
    }
    return content;
};
