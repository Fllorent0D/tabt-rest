import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { MatchService } from '../matches/match.service';
import { TeamMatchesEntry } from '../../entity/tabt-soap/TabTAPI_Port';
import { CacheService, TTL_DURATION } from '../../common/cache/cache.service';
import { firstValueFrom } from 'rxjs';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SocksProxyHttpClient } from '../../common/socks-proxy/socks-proxy-http-client';
import { ConfigService } from '@nestjs/config';
import { UserAgentsUtil } from '../../common/utils/user-agents.util';

export interface ExtractedMatchInfo {
  weekName?: string,
  divisionId?: number,
  season?: number,
  matchId: string
}

export class PlayersInfo {
  @ApiProperty()
  playerUniqueIndex: number;
  @ApiProperty()
  opponentPlayerUniqueIndex: number;
  @ApiProperty()
  playerName: string;
  @ApiProperty()
  opponentPlayerName: string;
}

export class MatchEntryHistory {
  @ApiPropertyOptional()
  season?: number;
  @ApiProperty()
  date: Date;
  @ApiProperty({ type: TeamMatchesEntry })
  matchEntry: TeamMatchesEntry;
  @ApiProperty()
  playerRanking: string;
  @ApiProperty()
  opponentRanking: string;
  @ApiProperty()
  score?: string;
}

export class Head2HeadData {
  @ApiProperty()
  head2HeadCount: number;
  @ApiProperty()
  victoryCount: number;
  @ApiProperty()
  defeatCount: number;
  @ApiPropertyOptional()
  lastVictory?: Date;
  @ApiPropertyOptional()
  lastDefeat?: Date;
  @ApiPropertyOptional()
  firstVictory?: Date;
  @ApiProperty({ type: [MatchEntryHistory] })
  matchEntryHistory: MatchEntryHistory[];
  @ApiProperty({ type: PlayersInfo })
  playersInfo: PlayersInfo;
}

@Injectable()
export class Head2headService {

  constructor(
    private readonly httpService: HttpService,
    private readonly matchService: MatchService,
    private readonly cacheService: CacheService,
    private readonly socksProxyService: SocksProxyHttpClient,
    private readonly configService: ConfigService,
  ) {
  }


  public async getHead2HeadResults(playerUniqueIndex: number, opponentPlayerUniqueIndex: number): Promise<Head2HeadData> {
    const getter = async () => {
      const htmlPage = await this.getPageFromAFTT(playerUniqueIndex, opponentPlayerUniqueIndex);
      const matchesExtracted = Head2headService.extractMatchesInfos(htmlPage);
      const playersInfo: PlayersInfo = Head2headService.extractPlayerNames(htmlPage);
      if (matchesExtracted.length > 0) {
        const matchesFound: Array<TeamMatchesEntry | undefined> = await Promise.all(matchesExtracted.map((m) => this.getMatchDetails(m)));
        const teamMatchEntries: TeamMatchesEntry[] = matchesFound.filter(match => !!match) as TeamMatchesEntry[];
        if (teamMatchEntries.length > 0) {
          return this.calculateHead2Head(teamMatchEntries, matchesExtracted, playersInfo);
        }
      }
      return {
        playersInfo,
        head2HeadCount: 0,
        victoryCount: 0,
        defeatCount: 0,
        matchEntryHistory: [],
      };
    };

    return this.cacheService.getFromCacheOrGetAndCacheResult(`head2head:${playerUniqueIndex}-${opponentPlayerUniqueIndex}`, getter, TTL_DURATION.EIGHT_HOURS);
  }

  private async getPageFromAFTT(playerA: number, playerB: number): Promise<string> {
    const result = await firstValueFrom(
      this.httpService.post(`https://resultats.aftt.be/index.php?menu=4&head=1&player_1=${playerA}&player_2=${playerB}`, {
          responseType: 'text',
          maxRedirects: 0,
        },
        {
          headers: {
            'user-agent': UserAgentsUtil.random,
          },
          httpsAgent: this.configService.get('USE_SOCKS_PROXY') === 'true' ? this.socksProxyService.createHttpsAgent() : undefined,
        }),
    );
    return result.data;
  }

  private static extractMatchesInfos(htmlPage: string): ExtractedMatchInfo[] {
    const regex = /(season=[0-9]+&sel=[0-9]+&detail=[0-9]+&week_name=[0-9]+&div_id=[0-9]+)">(\D+[0-2]\d\/\d+)/gm;
    const matches: ExtractedMatchInfo[] = [];
    let match: RegExpExecArray | null;
    do {
      match = regex.exec(htmlPage);
      if (match) {
        const matchQueryUrl: string = match[1];
        const parsed = Object.fromEntries(matchQueryUrl
          .split('&')
          .map(arg => arg.split('='))
          .filter(([key]) => ['season', 'week_name', 'div_id'].includes(key)));
        matches.push({
          matchId: match[2],
          weekName: parsed['week_name'],
          divisionId: parsed['div_id'],
          season: Number(parsed.season),
        });

      }

    } while (match);
    return matches;
  }

  private static extractPlayerNames(htmlPage: string): PlayersInfo {
    const regex = /id="player_[0-9]" name="player_[0-9]" value="([0-9]+)\/(.+)"/gm;
    let expExecArray: RegExpExecArray | null;
    const names = [];
    const uniqueIndexes = [];
    do {
      expExecArray = regex.exec(htmlPage);
      if (expExecArray) {
        uniqueIndexes.push(expExecArray[1]);
        names.push(expExecArray[2]);
      }

    } while (expExecArray);
    return {
      playerName: names[0],
      playerUniqueIndex: Number(uniqueIndexes[0]),
      opponentPlayerName: names[1],
      opponentPlayerUniqueIndex: Number(uniqueIndexes[1]),
    };
  }

  private async getMatchDetails(matchExtracted: ExtractedMatchInfo): Promise<TeamMatchesEntry | undefined> {
    const matches: TeamMatchesEntry[] = await this.matchService.getMatches({
      DivisionId: matchExtracted.divisionId,
      Season: matchExtracted.season,
      WeekName: matchExtracted.weekName,
      WithDetails: true,
    });
    if (matches.length > 0) {
      return matches.find((TeamMatchesEntry: TeamMatchesEntry) => TeamMatchesEntry.MatchId === matchExtracted.matchId);
    }

    return undefined;
  }

  private calculateHead2Head(teamMatchEntries: TeamMatchesEntry[], extractedMatches: ExtractedMatchInfo[], playersInfo: PlayersInfo): Head2HeadData {
    const head2HeadCount = teamMatchEntries.length;
    let victoryCount = 0;
    let defeatCount = 0;
    let lastVictory: Date | undefined;
    let firstVictory: Date | undefined;
    let lastDefeat: Date | undefined;
    const matchEntryHistory: MatchEntryHistory[] = [];

    for (const match of teamMatchEntries) {
      const linkedExtractedMatch = extractedMatches.find((m) => m.matchId === match.MatchId) as ExtractedMatchInfo;
      const season: number | undefined = linkedExtractedMatch.season;
      const isHomePlayer = match.MatchDetails.HomePlayers.Players.some(p => p.UniqueIndex === playersInfo.playerUniqueIndex);
      const player = isHomePlayer ?
        match.MatchDetails.HomePlayers.Players.find(p => p.UniqueIndex === playersInfo.playerUniqueIndex) :
        match.MatchDetails.AwayPlayers.Players.find(p => p.UniqueIndex === playersInfo.playerUniqueIndex);
      const opponent = isHomePlayer ?
        match.MatchDetails.AwayPlayers.Players.find(p => p.UniqueIndex === playersInfo.opponentPlayerUniqueIndex) :
        match.MatchDetails.HomePlayers.Players.find(p => p.UniqueIndex === playersInfo.opponentPlayerUniqueIndex);

      if (!player || !opponent) {
        continue;
      }
      const individualResult = match
        .MatchDetails
        .IndividualMatchResults
        .find((individualMatch) =>
          isHomePlayer ?
            individualMatch.HomePlayerUniqueIndex.includes(Number(playersInfo.playerUniqueIndex)) && individualMatch.AwayPlayerUniqueIndex.includes(Number(playersInfo.opponentPlayerUniqueIndex)) :
            individualMatch.AwayPlayerUniqueIndex.includes(Number(playersInfo.playerUniqueIndex)) && individualMatch.HomePlayerUniqueIndex.includes(Number(playersInfo.opponentPlayerUniqueIndex)));

      let score;
      if (individualResult) {
        score = (isHomePlayer) ?
          `${individualResult.HomeSetCount} - ${individualResult.AwaySetCount}` :
          `${individualResult.AwaySetCount} - ${individualResult.HomeSetCount}`;

        if ((isHomePlayer && individualResult.HomeSetCount === 3) || (!isHomePlayer && individualResult.AwaySetCount === 3)) {
          victoryCount = victoryCount + 1;
          if (!lastVictory || lastVictory < new Date(match.Date)) {
            lastVictory = new Date(match.Date);
          }
          if (!firstVictory || firstVictory > new Date(match.Date)) {
            firstVictory = new Date(match.Date);
          }
        } else {
          defeatCount = defeatCount + 1;
          if (!lastDefeat || lastDefeat < new Date(match.Date)) {
            lastDefeat = new Date(match.Date);
          }
        }
      }

      matchEntryHistory.push({
        season,
        date: new Date(match.Date),
        matchEntry: match,
        playerRanking: player.Ranking,
        opponentRanking: opponent.Ranking,
        score,
      });
    }
    return {
      head2HeadCount,
      defeatCount,
      victoryCount,
      lastVictory,
      firstVictory,
      lastDefeat,
      matchEntryHistory,
      playersInfo,
    };

  }

}
