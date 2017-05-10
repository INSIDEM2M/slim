interface ParseResult {
    description: string;
    context:
    {
        name: string;
        value: string;
    },
    file: {
        path: string;
    }
}

declare module "sassdoc" {
    export function parse(paths: string[]): Promise<ParseResult[]>;
}