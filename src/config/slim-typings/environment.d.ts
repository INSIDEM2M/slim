declare interface Environment {

    /**
     * The Git commit of the project.
     */
    commit: string;

    /**
     * The version of the package.
     */
    version: string;

    /**
     * The current environment. Example: `production`.
     */
    current: string;

    /**
     * The date of the build.
     */
    buildDate: string;
};

/**
 * The environment that was injected during the build.
 */
declare var environment: Environment;