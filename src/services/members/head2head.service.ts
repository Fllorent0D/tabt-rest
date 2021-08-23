import { HttpService, Injectable } from '@nestjs/common';
import { MatchService } from '../matches/match.service';
import { TeamMatchesEntry } from '../../entity/tabt-soap/TabTAPI_Port';
import { CacheService, TTL_DURATION } from '../../common/cache/cache.service';

export interface ExtractedMatchInfo {
  weekName?: string,
  divisionId?: number,
  season?: number,
  matchId: string
}

export interface MatchEntryHistory {
  season?: number;
  date: Date;
  matchEntry: TeamMatchesEntry;
  playerRanking: string;
  opponentRanking: string;
  score?: string;
}

export interface Head2HeadData {
  playerUniqueIndex: number;
  opponentPlayerUniqueIndex: number;
  head2HeadCount: number;
  victoryCount: number;
  defeatCount: number;
  lastVictory?: Date;
  firstVictory?: Date;
  matchEntryHistory: MatchEntryHistory[];
}

@Injectable()
export class Head2headService {

  constructor(
    private readonly httpService: HttpService,
    private readonly matchService: MatchService,
    private readonly cacheService: CacheService,
  ) {
  }


  public async getHead2HeadResults(playerUniqueIndex: number, opponentPlayerUniqueIndex: number): Promise<Head2HeadData> {
    const getter = async () => {
      const htmlPage = await this.getPageFromAFTT(playerUniqueIndex, opponentPlayerUniqueIndex);
      const matchesExtracted = this.extractMatchesInfos(htmlPage);

      if (matchesExtracted.length > 0) {
        const matchesFound: Array<TeamMatchesEntry | undefined> = await Promise.all(matchesExtracted.map((m) => this.getMatchDetails(m)));
        const teamMatchEntries: TeamMatchesEntry[] = matchesFound.filter(match => !!match) as TeamMatchesEntry[];
        if (teamMatchEntries.length > 0) {
          return this.calculateHead2Head(teamMatchEntries, matchesExtracted, playerUniqueIndex, opponentPlayerUniqueIndex);
        }
      }
      return {
        playerUniqueIndex: playerUniqueIndex,
        opponentPlayerUniqueIndex: opponentPlayerUniqueIndex,
        head2HeadCount: 0,
        victoryCount: 0,
        defeatCount: 0,
        matchEntryHistory: [],
      };
    };

    return this.cacheService.getFromCacheOrGetAndCacheResult(`h2h-${playerUniqueIndex}-${opponentPlayerUniqueIndex}`, getter, TTL_DURATION.EIGHT_HOURS);
  }

  private async getPageFromAFTT(playerA: number, playerB: number): Promise<string> {
    const result = await this.httpService.post(`https://resultats.aftt.be/index.php?menu=4&head=1&player_1=${playerA}&player_2=${playerB}`, {
      responseType: 'text',
      maxRedirects: 0,
    }).toPromise();

    return result.data;
  }

  private extractMatchesInfos(htmlPage: string): ExtractedMatchInfo[] {
    const regex = /\?(\S+=\S+&?)+">(\D+[0-2]\d\/\d+)/gm;
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

        console.log(parsed);
        matches.push({
          matchId: match[2],
          weekName: parsed['week_name'],
          divisionId: parsed['div_id'],
          season: parsed.season,
        });

      }

    } while (match);
    console.log(matches);
    return matches;
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

  private calculateHead2Head(teamMatchEntries: TeamMatchesEntry[], extractedMatches: ExtractedMatchInfo[], playerUniqueIndex: number, opponentPlayerUniqueIndex: number): Head2HeadData {
    const head2HeadCount = teamMatchEntries.length;
    let victoryCount = 0;
    let defeatCount = 0;
    let lastVictory: Date | undefined;
    let firstVictory: Date | undefined;
    const matchEntryHistory: MatchEntryHistory[] = [];

    for (const match of teamMatchEntries) {
      const linkedExtractedMatch = extractedMatches.find((m) => m.matchId === match.MatchId) as ExtractedMatchInfo;
      const season: number | undefined = linkedExtractedMatch.season;
      const isHomePlayer = match.MatchDetails.HomePlayers.Players.some(p => p.UniqueIndex === playerUniqueIndex);
      const player = isHomePlayer ?
        match.MatchDetails.HomePlayers.Players.find(p => p.UniqueIndex === playerUniqueIndex) :
        match.MatchDetails.AwayPlayers.Players.find(p => p.UniqueIndex === playerUniqueIndex);
      const opponent = isHomePlayer ?
        match.MatchDetails.AwayPlayers.Players.find(p => p.UniqueIndex === opponentPlayerUniqueIndex) :
        match.MatchDetails.HomePlayers.Players.find(p => p.UniqueIndex === opponentPlayerUniqueIndex);

      if (!player || !opponent) {
        continue;
      }
      const individualResult = match
        .MatchDetails
        .IndividualMatchResults
        .find((individualMatch) =>
          isHomePlayer ?
            individualMatch.HomePlayerUniqueIndex.includes(Number(playerUniqueIndex)) && individualMatch.AwayPlayerUniqueIndex.includes(Number(opponentPlayerUniqueIndex)) :
            individualMatch.AwayPlayerUniqueIndex.includes(Number(playerUniqueIndex)) && individualMatch.HomePlayerUniqueIndex.includes(Number(opponentPlayerUniqueIndex)));

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
      playerUniqueIndex,
      opponentPlayerUniqueIndex,
      head2HeadCount,
      defeatCount,
      victoryCount,
      lastVictory,
      firstVictory,
      matchEntryHistory,
    };

  }

}
