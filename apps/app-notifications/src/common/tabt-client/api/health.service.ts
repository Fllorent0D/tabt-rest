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
import { CheckHealth200Response } from '../model/checkHealth200Response';
import { TestOutput } from '../model/testOutput';
import { Configuration } from '../configuration';

@Injectable()
export class HealthService {
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
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public checkHealth(): Observable<AxiosResponse<CheckHealth200Response>>;
  public checkHealth(): Observable<any> {
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

        return this.httpClient.get<CheckHealth200Response>(
          `${this.basePath}/v1/health`,
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
   * @param xTabtAccount Account to do a request
   * @param xTabtPassword Password of the account
   * @param xTabtOnBehalfOf On Behalf of
   * @param xTabtDatabase Database to query
   * @param xTabtSeason Season name to query
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public context(
    xTabtAccount?: string,
    xTabtPassword?: string,
    xTabtOnBehalfOf?: string,
    xTabtDatabase?: 'aftt' | 'vttl',
    xTabtSeason?: string,
  ): Observable<AxiosResponse<any>>;
  public context(
    xTabtAccount?: string,
    xTabtPassword?: string,
    xTabtOnBehalfOf?: string,
    xTabtDatabase?: 'aftt' | 'vttl',
    xTabtSeason?: string,
  ): Observable<any> {
    const headers = { ...this.defaultHeaders };
    if (xTabtAccount !== undefined && xTabtAccount !== null) {
      headers['X-Tabt-Account'] = String(xTabtAccount);
    }
    if (xTabtPassword !== undefined && xTabtPassword !== null) {
      headers['X-Tabt-Password'] = String(xTabtPassword);
    }
    if (xTabtOnBehalfOf !== undefined && xTabtOnBehalfOf !== null) {
      headers['X-Tabt-OnBehalfOf'] = String(xTabtOnBehalfOf);
    }
    if (xTabtDatabase !== undefined && xTabtDatabase !== null) {
      headers['X-Tabt-Database'] = String(xTabtDatabase);
    }
    if (xTabtSeason !== undefined && xTabtSeason !== null) {
      headers['X-Tabt-Season'] = String(xTabtSeason);
    }

    const accessTokenObservable: Observable<any> = of(null);

    // to determine the Accept header
    const httpHeaderAccepts: string[] = [];
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

        return this.httpClient.get<any>(`${this.basePath}/v1/health/context`, {
          withCredentials: this.configuration.withCredentials,
          headers: headers,
        });
      }),
    );
  }
  /**
   *
   *
   * @param xTabtAccount Account to do a request
   * @param xTabtPassword Password of the account
   * @param xTabtOnBehalfOf On Behalf of
   * @param xTabtDatabase Database to query
   * @param xTabtSeason Season name to query
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public testRequest(
    xTabtAccount?: string,
    xTabtPassword?: string,
    xTabtOnBehalfOf?: string,
    xTabtDatabase?: 'aftt' | 'vttl',
    xTabtSeason?: string,
  ): Observable<AxiosResponse<TestOutput>>;
  public testRequest(
    xTabtAccount?: string,
    xTabtPassword?: string,
    xTabtOnBehalfOf?: string,
    xTabtDatabase?: 'aftt' | 'vttl',
    xTabtSeason?: string,
  ): Observable<any> {
    const headers = { ...this.defaultHeaders };
    if (xTabtAccount !== undefined && xTabtAccount !== null) {
      headers['X-Tabt-Account'] = String(xTabtAccount);
    }
    if (xTabtPassword !== undefined && xTabtPassword !== null) {
      headers['X-Tabt-Password'] = String(xTabtPassword);
    }
    if (xTabtOnBehalfOf !== undefined && xTabtOnBehalfOf !== null) {
      headers['X-Tabt-OnBehalfOf'] = String(xTabtOnBehalfOf);
    }
    if (xTabtDatabase !== undefined && xTabtDatabase !== null) {
      headers['X-Tabt-Database'] = String(xTabtDatabase);
    }
    if (xTabtSeason !== undefined && xTabtSeason !== null) {
      headers['X-Tabt-Season'] = String(xTabtSeason);
    }

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

        return this.httpClient.get<TestOutput>(
          `${this.basePath}/v1/health/test`,
          {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
          },
        );
      }),
    );
  }
}
