export const commands: Command[] = [
    {
        name: "new", options: [
            { name: "component", alias: "c", type: Boolean, description: "Create a component project." },
            { name: "portal", alias: "p", type: Boolean, description: "Create a portal project." },
            { name: "app", alias: "a", type: Boolean, description: "Create an app project." }
        ]
    },
    {
        name: "dev", description: "Start a development server.", options: [
            { name: "open", alias: "o", type: Boolean, description: "Automatically open the web browser." },
            { name: "update-dlls", alias: "u", type: Boolean, description: "Create dynamically linked libraries for vendors (@angular/core, etc.) and polyfills. This has to be run after the dependencies have been updated." }
        ]
    },
    {
        name: "build", options: [
            { name: "minify", type: Boolean, description: "Use UglifyJS to minify the bundle." },
            { name: "aot", type: Boolean, description: "Use the Angular AOT compiler." },
            { name: "serve", type: Boolean, description: "Serve the application after it was built." }
        ]
    },
    {
        name: "test", description: "Run the unit tests.", options: [
            { name: "watch", alias: "w", type: Boolean, description: "Watch the test und project files and re-run the unit tests on change." },
            { name: "coverage", type: Boolean, description: "Create coverage report." }
        ]
    },
    {
        name: "e2e", description: "", options: [
            { name: "nobuild", description: "Use the last build for the E2E test.", type: Boolean },
            { name: "specs", typeLabel: "[underline]{files}", description: "Only run the these E2E tests." }
        ]
    },
    {
        name: "release", description: "Perform a release. Updates the version in the package.json.", options: [
            { name: "patch", description: "Perform a patch release.", defaultOption: true, type: Boolean },
            { name: "minor", description: "Perform a minor release.", type: Boolean },
            { name: "major", description: "Perform a major release.", type: Boolean },
            { name: "use-version", description: "Release the given version.", type: String }
        ]
    },
    { name: "changelog", description: "Create the changelog from the git log." },
    { name: "publish", description: "Publish the package to the npm registry and the central git repository." }
];
