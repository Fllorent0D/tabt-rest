export interface RunnerContext {
    name: string;
    version: string;
    pid: number;
    season: number;
}

export interface CallerContext {
    [key: string]: string;
    correlationId: string;
    remoteAddress: string;
}

export interface Context {
    runner: RunnerContext;
    caller?: CallerContext;
}
