import { Injectable } from '@nestjs/common';
import { TestOutput } from '../../entity/tabt-soap/TabTAPI_Port';
import { TabtClientService } from '../../common/tabt-client/tabt-client.service';

@Injectable()
export class TestRequestService {
  constructor(private tabtClient: TabtClientService) {}

  async testRequest(): Promise<TestOutput> {
    const [result] = await this.tabtClient.TestAsync({});
    return result;
  }
}
