interface Logger {
    log(message: any);
    log(...message: any[]);

    trace(message: any);
    trace(...message: any[]);

    debug(message: any);
    debug(...message: any[]);

    info(message: any);
    info(...message: any[]);

    warn(message: any);
    warn(...message: any[]);

    error(message: any);
    error(...message: any[]);
}

interface LoggerOptions {
    level?: "log" | "trace" | "debug" | "info" | "warn" | "error";
    format?: string;
    dateformat?: string;
    preprocess?: (data: any) => any
    filters?: any[];
}

declare module "tracer" {
    export function console(options?: LoggerOptions): Logger;
    export function colorConsole(options?: LoggerOptions): Logger;
}