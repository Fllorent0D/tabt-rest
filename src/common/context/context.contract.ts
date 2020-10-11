export interface RunnerContext {
    name: string;
    version: string;
    pid: number;
}

export interface CallerContext {
    [key: string]: string;
    correlationId: string;
}

export interface Context {
    runner: RunnerContext;
    caller?: CallerContext;
}
