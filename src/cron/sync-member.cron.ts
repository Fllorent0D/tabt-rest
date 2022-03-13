import { Inject, Injectable, Logger, Scope } from '@nestjs/common';
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';
import { MemberService } from '../services/members/member.service';
import { ElasticSearchService } from '../common/elastic/elastic-search.service';
import { Injector } from '@nestjs/core/injector/injector';
import { TabtClientService } from '../common/tabt-client/tabt-client.service';
import { TabTAPISoap } from '../entity/tabt-soap/TabTAPI_Port';
import { TIMEOUT_EXCEEDED } from '@nestjs/terminus/dist/errors/messages.constant';

@Injectable({scope: Scope.DEFAULT})
export class SyncMemberCron {
  private readonly logger = new Logger(SyncMemberCron.name);

  constructor(
    @Inject('tabt-aftt') private readonly tabtAFTT: TabTAPISoap,
    private readonly elasticService: ElasticSearchService,
  ) {
  }

  @Timeout(5000)
  async syncMembersToElastic() {
    this.logger.debug('Members sync for lookup starting...');
    try {
      const [results] = await this.tabtAFTT.GetMembersAsync({ NameSearch: ' ' });
      await this.elasticService.client.deleteByQuery({
        index: 'members',
        conflicts: 'proceed',
        query: { match_all: {} },
      });
      const operations = (results.MemberEntries ?? []).flatMap(doc => [{ index: { _index: 'members', _id: doc.UniqueIndex } }, doc]);
      await this.elasticService.client.bulk({ refresh: true, pipeline: 'name-pp', operations });
      this.logger.debug('Members sync for lookup ended successfully...');
    } catch (e) {
      this.logger.error(e, e.stack, 'Members sync for lookup ended with an error...');
    }

  }
}
