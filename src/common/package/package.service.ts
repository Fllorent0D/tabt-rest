/**
 * Service providing access to 'package.json' information like version, name, ...
 *
 * @export
 * @class PackageService
 */
import { Injectable } from '@nestjs/common';


@Injectable ()
export class PackageService {
    /**
     * Relative path to the 'package.json' file
     *
     * @private
     * @static
     * @memberof PackageService
     */
    private static PackageJsonPath = '../../../package.json';

    private _packageInfo: any;

    /**
     * Creates an instance of PackageService.
     *
     * @param {LoggingService} _loggingService logging service
     * @memberof PackageService
     */
    constructor() {
        this._packageInfo = require(PackageService.PackageJsonPath);
    }

    /**
     * Gets the package version.
     *
     * @readonly
     * @type {string}
     * @memberof Package
     */
    get version(): string {
        return this._packageInfo.version;
    }

    /**
     * Gets the package name.
     *
     * @readonly
     * @type {string}
     * @memberof Package
     */
    get name(): string {
        return this._packageInfo.name;
    }
}
