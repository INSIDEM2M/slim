/// <reference types='typescript/lib/typescriptServices' />

declare module "portfinder";
declare module "command-line-usage";
declare module "progress-bar-webpack-plugin";
declare module "local-web-server";
declare module "autoprefixer";

declare type Environment = "development" | "production" | string;

declare type Browser = "Chrome" | "Firefox" | "Safari";

declare interface Options {
    component?: boolean;
    portal?: boolean;
    app?: boolean;
    minify?: boolean;
    aot?: boolean;
    serve?: boolean;
    open?: boolean;
    watch?: boolean;
    coverage?: boolean;
    browsers?: string;
    specs?: string;
    patch?: boolean;
    minor?: boolean;
    major?: boolean;
    "no-update"?: boolean;
    "no-build"?: boolean;
    "xml-report"?: string;
    "use-version"?: string;
    "update-dlls": boolean;
}

declare interface EnvironmentVariables {
    commit: string;
    buildDate: string;
    environment: Environment;
}