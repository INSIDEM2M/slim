/// <reference types='typescript/lib/typescriptServices' />

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
    "skip-update"?: boolean;
    "skip-build"?: boolean;
    "xml-report"?: string;
    "use-version"?: string;
    "update-dlls": boolean;
}