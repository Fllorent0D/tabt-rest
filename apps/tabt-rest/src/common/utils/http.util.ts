export abstract class HttpUtil {
    private static PATH_REGEX = new RegExp('^http(s)?:\\/\\/');

    static getHeaderValue(request: Express.Request, key: string): string | undefined {
        return (<any>request).headers[key.toLowerCase()];
    }

    static isUrl(path: string): boolean {
        return this.PATH_REGEX.test(path);
    }
}
