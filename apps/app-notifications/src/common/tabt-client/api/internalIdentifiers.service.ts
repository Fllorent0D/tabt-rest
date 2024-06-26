/**
 * TabT Rest
 * This api is a bridge to the TabT SOAP API. It contacts TabT and cache results in order to reduce latency for some requests. More documentation will come.<br>       The data present in the api such as player names, club names, tournaments or match results are not managed by us. This information is made freely available by the Aile Francophone de Tennis de Table and the Vlaamse Tafeltennisliga. We therefore cannot be held responsible for the publication of this information. If changes need to be made, you should contact the responsible entity.     If you build an application on top of the BePing\'s api, be sure to do at least one of the following things:         <ul><li>If possible, set a X-Application-For header string. Include the name of your application, and a way to contact you in case something would go wrong.<br>       An example user agent string format is, which could result in the following string: beping/2.0.0 (floca.be; florent@floca.be). The use of a header like this isn’t obligated or enforced, but allows for better communication.</li></ul>
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: f.cardoen@me.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/* tslint:disable:no-unused-variable member-ordering */

import { Injectable, Optional } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Observable, of, switchMap } from 'rxjs';
import { InternalIdentifiersDTO } from '../model/internalIdentifiersDTO';
import { RedirectLinkDTO } from '../model/redirectLinkDTO';
import { Configuration } from '../configuration';

@Injectable()
export class InternalIdentifiersService {
  protected basePath = 'http://localhost:3004';
  public defaultHeaders: Record<string, string> = {};
  public configuration = new Configuration();

  constructor(
    protected httpClient: HttpService,
    @Optional() configuration: Configuration,
  ) {
    this.configuration = configuration || this.configuration;
    this.basePath = configuration?.basePath || this.basePath;
  }

  /**
   * @param consumes string[] mime-types
   * @return true: consumes contains 'multipart/form-data', false: otherwise
   */
  private canConsumeForm(consumes: string[]): boolean {
    const form = 'multipart/form-data';
    return consumes.includes(form);
  }

  /**
   *
   *
   * @param clubUniqueIndex
   * @param playerUniqueIndex
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getInternalIds(
    clubUniqueIndex: string,
    playerUniqueIndex: number,
  ): Observable<AxiosResponse<InternalIdentifiersDTO>>;
  public getInternalIds(
    clubUniqueIndex: string,
    playerUniqueIndex: number,
  ): Observable<any> {
    if (clubUniqueIndex === null || clubUniqueIndex === undefined) {
      throw new Error(
        'Required parameter clubUniqueIndex was null or undefined when calling getInternalIds.',
      );
    }

    if (playerUniqueIndex === null || playerUniqueIndex === undefined) {
      throw new Error(
        'Required parameter playerUniqueIndex was null or undefined when calling getInternalIds.',
      );
    }

    const queryParameters = new URLSearchParams();
    if (clubUniqueIndex !== undefined && clubUniqueIndex !== null) {
      queryParameters.append('clubUniqueIndex', <any>clubUniqueIndex);
    }
    if (playerUniqueIndex !== undefined && playerUniqueIndex !== null) {
      queryParameters.append('playerUniqueIndex', <any>playerUniqueIndex);
    }

    const headers = { ...this.defaultHeaders };

    const accessTokenObservable: Observable<any> = of(null);

    // to determine the Accept header
    const httpHeaderAccepts: string[] = ['application/json'];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers['Accept'] = httpHeaderAcceptSelected;
    }

    // to determine the Content-Type header
    const consumes: string[] = [];
    return accessTokenObservable.pipe(
      switchMap((accessToken) => {
        if (accessToken) {
          headers['Authorization'] = `Bearer ${accessToken}`;
        }

        return this.httpClient.get<InternalIdentifiersDTO>(
          `${this.basePath}/v1/internal-identifiers`,
          {
            params: queryParameters,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
          },
        );
      }),
    );
  }
  /**
   *
   *
   * @param clubUniqueIndex
   * @param playerUniqueIndex
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getRegisterLink(
    clubUniqueIndex: string,
    playerUniqueIndex: number,
  ): Observable<AxiosResponse<RedirectLinkDTO>>;
  public getRegisterLink(
    clubUniqueIndex: string,
    playerUniqueIndex: number,
  ): Observable<any> {
    if (clubUniqueIndex === null || clubUniqueIndex === undefined) {
      throw new Error(
        'Required parameter clubUniqueIndex was null or undefined when calling getRegisterLink.',
      );
    }

    if (playerUniqueIndex === null || playerUniqueIndex === undefined) {
      throw new Error(
        'Required parameter playerUniqueIndex was null or undefined when calling getRegisterLink.',
      );
    }

    const queryParameters = new URLSearchParams();
    if (clubUniqueIndex !== undefined && clubUniqueIndex !== null) {
      queryParameters.append('clubUniqueIndex', <any>clubUniqueIndex);
    }
    if (playerUniqueIndex !== undefined && playerUniqueIndex !== null) {
      queryParameters.append('playerUniqueIndex', <any>playerUniqueIndex);
    }

    const headers = { ...this.defaultHeaders };

    const accessTokenObservable: Observable<any> = of(null);

    // to determine the Accept header
    const httpHeaderAccepts: string[] = ['application/json'];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers['Accept'] = httpHeaderAcceptSelected;
    }

    // to determine the Content-Type header
    const consumes: string[] = [];
    return accessTokenObservable.pipe(
      switchMap((accessToken) => {
        if (accessToken) {
          headers['Authorization'] = `Bearer ${accessToken}`;
        }

        return this.httpClient.get<RedirectLinkDTO>(
          `${this.basePath}/v1/internal-identifiers/link`,
          {
            params: queryParameters,
            withCredentials: this.configuration.withCredentials,
            headers: headers,
          },
        );
      }),
    );
  }
}
