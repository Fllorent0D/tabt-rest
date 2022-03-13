import { Injectable } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ElasticSearchService {
  client: Client;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.client = new Client({
      auth: {
        username: this.configService.get('ELASTIC_USER'),
        password: this.configService.get('ELASTIC_PASSWORD'),
      },
      node: this.configService.get('ELASTIC_URL'),
    });

  }

}
