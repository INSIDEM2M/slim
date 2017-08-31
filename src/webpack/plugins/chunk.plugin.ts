import * as webpack from "webpack";

export const extractBundles = bundles => ({
    plugins: bundles.map(bundle => new webpack.optimize.CommonsChunkPlugin(bundle))
});
