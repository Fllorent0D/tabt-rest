import { Inject, Injectable, Logger } from '@nestjs/common';
import * as lunr from 'lunr';
import { MemberEntry, TabTAPISoap } from '../../entity/tabt-soap/TabTAPI_Port';
import { CacheService, TTL_DURATION } from '../../common/cache/cache.service';
import { Timeout } from '@nestjs/schedule';

@Injectable()
export class MembersSearchIndexService {
  private index: lunr.Index;
  private members: MemberEntry[];

  private readonly logger = new Logger(MembersSearchIndexService.name);

  constructor(
    @Inject('tabt-aftt') private readonly tabtAFTT: TabTAPISoap,
    private readonly cacheService: CacheService,
  ) {
  }

  search(queryString: string) {
    let query = '';
    const searchTerms = queryString
      .trim()
      .replace(/-/g, ' ')
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .split(' ');
    this.logger.debug(`Quick members search. Query: ${queryString}`);

    if (searchTerms.length === 1) {
      query = searchTerms[0] + '* ' + searchTerms[0] + '^10';
    } else {
      for (const term of searchTerms.slice(0, searchTerms.length - 1)) {
        if (term.length >= 3) {
          query += `${term}~1 ${term}^20 `;
        }
      }
      query += `${searchTerms[searchTerms.length - 1]}*^10 ${searchTerms[searchTerms.length - 1]}~1 ${searchTerms[searchTerms.length - 1]}^20`;

    }
    this.logger.debug(`Query to index: ${query}`);
    const results = this.index.search(query);
    this.logger.debug(`Found ${results.length} results.`);

    return results.slice(0, 20).map((r) => {
      return this.members.find((member) => member.UniqueIndex === Number(r.ref));
    });
  }

  @Timeout(0)
  async indexMembers() {
    const members = await this.cacheService.getFromCacheOrGetAndCacheResult('members:all', async () => {
      const [memberOutput] = await this.tabtAFTT.GetMembersAsync({ NameSearch: ' ' });
      return memberOutput.MemberEntries;
    }, TTL_DURATION.TWELVE_HOURS);
    this.logger.debug(`Cached ${members.length} member entries`);

    this.index = lunr(function() {
      this.ref('UniqueIndex');
      this.field('FullName');

      members.forEach(function(doc) {
        this.add({
          UniqueIndex: doc.UniqueIndex,
          FullName: doc.FirstName.toUpperCase() + ' ' + doc.LastName.toUpperCase(),
        });
      }, this);
      this.build();
    });
    this.members = members;

    this.logger.debug(`Index created.`);

  }

}
