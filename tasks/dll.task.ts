import * as path from "path";
import * as webpack from "webpack";
import * as webpackMerge from "webpack-merge";

import { getAvailablePort } from "../cli-helpers";
import { getCommonConfigPartial } from "../webpack/webpack.config.common";
import { getDevConfigPartial } from "../webpack/webpack.config.dev";
import { getDllConfigPartial } from "../webpack/webpack.config.dll";

export default function (env: EnvironmentVariables, config: IM2MConfig) {
    return getAvailablePort().then(port => {
        const indexPath = path.join(config.sourceDir, "index.html");
        const commonConfig = getCommonConfigPartial(indexPath, env, config);
        const buildConfig = getDllConfigPartial(path.join(config.dllDir));
        const webpackConfig = (webpackMerge as any).strategy({
            "entry": "replace"  
        })(commonConfig, buildConfig);
        return runBuild(webpackConfig);
    });
}

function runBuild(config: webpack.Configuration) {
    return new Promise((resolve, reject) => {
        webpack(config, (error, stats) => {
            if (stats.hasErrors()) {
                return reject(stats.toJson().errors[0]);
            }
            resolve(0);
        });
    });
}