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
import { ClubDashboardDTOV1 } from '../model/clubDashboardDTOV1';
import { Configuration } from '../configuration';

@Injectable()
export class DashboardsService {
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
   * @param uniqueIndex
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public clubDashboardControllerClubDashboardV1(
    uniqueIndex: string,
  ): Observable<AxiosResponse<ClubDashboardDTOV1>>;
  public clubDashboardControllerClubDashboardV1(
    uniqueIndex: string,
  ): Observable<any> {
    if (uniqueIndex === null || uniqueIndex === undefined) {
      throw new Error(
        'Required parameter uniqueIndex was null or undefined when calling clubDashboardControllerClubDashboardV1.',
      );
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

        return this.httpClient.get<ClubDashboardDTOV1>(
          `${this.basePath}/v1/dashboard/club/${encodeURIComponent(String(uniqueIndex))}`,
          {
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
   * @param divisionId
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public divisionDashboardControllerMemberDashboardV1(
    divisionId: number,
  ): Observable<AxiosResponse<object>>;
  public divisionDashboardControllerMemberDashboardV1(
    divisionId: number,
  ): Observable<any> {
    if (divisionId === null || divisionId === undefined) {
      throw new Error(
        'Required parameter divisionId was null or undefined when calling divisionDashboardControllerMemberDashboardV1.',
      );
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

        return this.httpClient.get<object>(
          `${this.basePath}/v1/dashboard/division/${encodeURIComponent(String(divisionId))}`,
          {
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
   * @param uniqueIndex
   * @param category
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public memberDashboardControllerMemberDashboardV1(
    uniqueIndex: number,
    category?: 'MEN' | 'WOMEN' | 'VETERANS' | 'VETERANS_WOMEN' | 'YOUTH',
  ): Observable<AxiosResponse<object>>;
  public memberDashboardControllerMemberDashboardV1(
    uniqueIndex: number,
    category?: 'MEN' | 'WOMEN' | 'VETERANS' | 'VETERANS_WOMEN' | 'YOUTH',
  ): Observable<any> {
    if (uniqueIndex === null || uniqueIndex === undefined) {
      throw new Error(
        'Required parameter uniqueIndex was null or undefined when calling memberDashboardControllerMemberDashboardV1.',
      );
    }

    const queryParameters = new URLSearchParams();
    if (category !== undefined && category !== null) {
      queryParameters.append('category', <any>category);
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

        return this.httpClient.get<object>(
          `${this.basePath}/v1/dashboard/member/${encodeURIComponent(String(uniqueIndex))}`,
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