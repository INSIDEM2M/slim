/**
 * Configuration for the slim CLI. All directory paths are relative to the
 * rootDir if not stated explicitly.
 */
export declare interface SlimConfig {

    /**
     * The root directory of the project. Defaults to the current
     * working directory.
     */
    rootDir?: string;

    /**
     * Directory where the webpack DLLs are saved.
     */
    dllDir?: string;

    /**
     * Directory where the source files are.
     */
    sourceDir?: string;

    /**
     * Directory where the build is saved.
     */
    targetDir?: string;

    /**
     * Directory of the test coverage files.
     */
    coverageDir?: string;

    /**
     * Directory containing the End-To-End tests.
     */
    e2eDir?: string;

    /**
     * Base Href of the application.
     */
    baseHref?: string;

    /**
     * Angular settings.
     */
    angular?: {

        /**
         * Path to the application's root NgModule. Relative to the sourceDir.
         */
        appModule?: string;

        /**
         * Path to the tsconfig.json that should be used for the Angular AOT compiler.
         * Relative to the sourceDir.
         */
        aotTsConfig?: string;
    };

    /**
     * TypeScript settings.
     */
    typescript?: {

        /**
         * Entry file of the application. Relative to the sourceDir.
         */
        entry?: string;

        /**
         * Name of the output .js bundle.
         */
        output?: string;

        /**
         * List of libraries to be included in the DLLs. Put all libraries
         * in here that don't change often and that you don't want to link.
         */
        vendors?: string[];
    };

    /**
     * Sass settings.
     */
    sass?: {

        /**
         * Paths to include when resolving relative imports.
         */
        includePaths?: string[];

        /**
         * Style of the generated CSS. Use expanded for debugging, compressed otherwise. 
         */
        outputStyle?: "expanded" | "compressed";

        /**
         * Precision of computations performed by the Sass compiler.
         */
        precision?: number;

        /**
         * Paths to the global styles that will be injected into the index.html.
         */
        globalStyles?: string[];
    };

    /**
     * Image settings.
     */
    images?: {

        /**
         * Path to the image files that should be processed and copied to the
         * targetDir on build.
         */
        entries?: string[];

        /**
         * Minification settings.
         */
        minify?: {

            optimizationLevel?: number;
            progressive?: boolean;
            interlaced?: boolean;
        };
        flatten?: boolean;
    };

    /**
     * Extra settings.
     */
    extras?: {
        entries?: string[];
        flatten?: boolean;
    };
}