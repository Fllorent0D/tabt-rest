import { createClientAsync, HttpClient } from 'soap';
import { Logger } from '@nestjs/common';

export const createSoapClient = (url: string, httpClient?: HttpClient) => {
  const logger = new Logger(createSoapClient.name);

  logger?.log(`Create SOAP client: ${url}. Using custom HttpClient: ${!!httpClient}`);
  return createClientAsync(url, {
    returnFault: false,
    httpClient: httpClient,
  });
}
