import { Inject, Injectable, Logger } from '@nestjs/common';
import * as lunr from 'lunr';
import { MemberEntry, TabTAPISoap } from '../../entity/tabt-soap/TabTAPI_Port';

@Injectable()
export class MembersSearchIndexService {
  private index: lunr.Index;
  private members: MemberEntry[];

  private readonly logger = new Logger(MembersSearchIndexService.name);

  constructor(
    @Inject('tabt-aftt') private readonly tabtAFTT: TabTAPISoap,
  ) {
  }

  search(queryString: string) {
    let query = '';
    const searchTerms = queryString.trim().split(' ');
    this.logger.debug(`Quick members search. Query: ${queryString}`);

    if (searchTerms.length === 1) {
      query = searchTerms[0] + '* ' + searchTerms[0];
    } else {
      for (const term of searchTerms.slice(0, searchTerms.length - 1)) {
        query += `+${term}~1 `;
      }
      query += `+${searchTerms[searchTerms.length - 1]}*`;
    }
    this.logger.debug(`Query to index: ${query}`);
    const results = this.index.search(query);
    this.logger.debug(`Found ${results.length} results.`);

    return results.map((r) => {
      return this.members.find((member) => member.UniqueIndex === Number(r.ref));
    });
  }

  async indexMembers() {
    const [memberOutput] = await this.tabtAFTT.GetMembersAsync({ NameSearch: ' ' });
    this.logger.debug(`Fetched ${memberOutput.MemberCount} member entries`);

    this.index = lunr(function() {
      this.ref('UniqueIndex');
      this.field('FullName');

      memberOutput.MemberEntries.forEach(function(doc) {
        this.add({
          UniqueIndex: doc.UniqueIndex,
          FullName: doc.FirstName.toUpperCase() + ' ' + doc.LastName.toUpperCase(),
        });
      }, this);
      this.build();
    });
    this.members = memberOutput.MemberEntries;

    this.logger.debug(`Index created.`);

  }

}
