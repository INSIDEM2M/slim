import { webDriverUpdate, runProtractor } from "../e2e-helpers";
import * as path from "path";

export default function (env: EnvironmentVariables, config: IM2MConfig, port: number, skipWebDriverUpdate: boolean, specs?: string) {
    return (skipWebDriverUpdate ? Promise.resolve(0) : webDriverUpdate()).then((exitCode) => {
        if (exitCode === 0) {
            let specPaths = path.join(config.e2eDir, "**", "*.e2e.ts");
            if (specs) {
                specPaths = specs.split(",").map(spec => path.resolve(path.join(__dirname, "..", "config"), path.join(config.rootDir, spec))).join(",");
            }
            return runProtractor(port, specPaths);
        } else {
            return exitCode;
        }
    });
}

