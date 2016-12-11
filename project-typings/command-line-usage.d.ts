declare interface CommandLineUsageOption {
    name: string;
    description?: string;
    type?: any;
    alias?: string;
    typeLabel?: string;
    defaultOption?: boolean;
    multiple?: boolean;
}

declare interface CommandLineUsageSection {
    header: string;
    content?: string | string[];
    optionList?: CommandLineUsageOption[];
}

declare module "command-line-usage" {

    const usage: (sections: CommandLineUsageSection[]) => string;

    export = usage;

}

declare interface Command {
    name: string;
    options?: CommandLineUsageOption[];
    description?: string;
}