/**
 * Service providing access to 'package.json' information like version, name, ...
 *
 * @export
 * @class PackageService
 */
import { Injectable } from '@nestjs/common';

//import { readPackageUp } from 'read-pkg-up';

@Injectable()
export class PackageService {
  /**
   * Relative path to the 'package.json' file
   *
   * @private
   * @static
   * @memberof PackageService
   */

  private _packageInfo: any;

  /**
   * Creates an instance of PackageService.
   *
   * @param {LoggingService} _loggingService logging service
   * @memberof PackageService
   */
  constructor() {
    //this._packageInfo = require(PackageService.PackageJsonPath);
  }

  async init(): Promise<void> {
    //this._packageInfo = await readPackageUp()
  }

  /**
   * Gets the package version.
   *
   * @readonly
   * @type {string}
   * @memberof Package
   */
  get version(): string {
    return this._packageInfo?.version;
  }

  /**
   * Gets the package name.
   *
   * @readonly
   * @type {string}
   * @memberof Package
   */
  get name(): string {
    return this._packageInfo?.name;
  }
}
