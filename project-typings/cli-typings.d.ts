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
    nobuild?: boolean;
    specs?: string[];
    patch?: boolean;
    minor?: boolean;
    major?: boolean;
    "use-version"?: string;
    "update-dlls": boolean;
}

declare interface IM2MConfig {
    rootDir?: string;
    dllDir?: string;
    sourceDir?: string;
    targetDir?: string;
    coverageDir?: string;
    e2eDir?: string;
    baseHref?: string;
    angular?: {
        appModule?: string;
        aotTsConfig?: string;
    };
    typescript?: {
        entry: string;
        output: string;
        vendors?: string[];
    };
    sass?: {
        includePaths?: string[];
        outputStyle?: "expanded" | "compressed";
        precision?: number;
        globalStyles?: string[];
    };
    images?: {
        entries?: string[];
        minify?: {
            optimizationLevel?: number;
            progressive?: boolean;
            interlaced?: boolean;
        };
        flatten?: boolean;
    };
    fonts?: {
        entries?: string[];
        targetDir?: string;
        flatten?: boolean;
    };
    extras?: {
        entries?: string[];
        flatten?: boolean;
    }
}

declare interface EnvironmentVariables {
    commit: string;
    buildDate: string;
    environment: Environment;
}