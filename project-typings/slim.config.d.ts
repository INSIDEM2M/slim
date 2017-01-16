export declare interface SlimConfig {
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
        entry?: string;
        output?: string;
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