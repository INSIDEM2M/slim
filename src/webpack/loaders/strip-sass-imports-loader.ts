import * as loaderUtils from "loader-utils";

export interface StripSassImportsLoaderQuery {
    importsIgnoredDuringTesting: string[];
    stripSassImports: boolean;
}

/**
 * This loader is needed to remove imports to non-existing sass files
 * during testing.
 */
module.exports = function (content: Buffer) {
    const query: StripSassImportsLoaderQuery = loaderUtils.parseQuery(this.query);
    if (query.stripSassImports) {
        if (query.importsIgnoredDuringTesting && Array.isArray(query.importsIgnoredDuringTesting) && query.importsIgnoredDuringTesting.length > 0) {
            let sassContent = content.toString();
            for (let ignoredImport of query.importsIgnoredDuringTesting) {
                const regex = new RegExp(`@import\\s['|"].*${ignoredImport}.*['|"];`);
                sassContent = sassContent.replace(regex, "");
            }
            return sassContent;
        }
    }
    return content;
};