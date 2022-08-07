import { Injectable } from '@nestjs/common';
import { Player, TeamMatchesEntry } from '../../entity/tabt-soap/TabTAPI_Port';
import { MatchService } from './match.service';
import { CacheService, TTL_DURATION } from '../../common/cache/cache.service';
import { MemberResults } from '../../common/dto/member-ranking.dto';

export enum SortSystem {
  MOST_PLAYED,
  BEST_PERF_PER_PCT,
  BEST_PERF_PER_WIN,
  // RANKING To Do
}

@Injectable()
export class MatchesMembersRankerService {
  constructor(
    private matchService: MatchService,
    private cacheService: CacheService,
  ) {
  }

  async getMembersRankingFromDivision(divisionId: number, season: number, sortingSystem: SortSystem = SortSystem.BEST_PERF_PER_WIN): Promise<MemberResults[]> {
    // Télécharger les matchs
    const getter = async () => {
      const matches = await this.matchService.getMatches({
        Season: season,
        DivisionId: divisionId,
        WithDetails: true,
      });

      return MatchesMembersRankerService.computeRanking(matches, sortingSystem);
    };
    return this.cacheService.getFromCacheOrGetAndCacheResult(`members-ranking-division:${season}:${divisionId}`, getter, TTL_DURATION.EIGHT_HOURS);
  }

  async getMembersRankingFromClub(club: string, season: number, sortingSystem: SortSystem = SortSystem.BEST_PERF_PER_PCT): Promise<MemberResults[]> {
    // Télécharger les matchs
    const getter = async () => {
      const matches = await this.matchService.getMatches({
        Season: season,
        Club: club,
        WithDetails: true,
      });

      return MatchesMembersRankerService.computeRanking(matches, sortingSystem, club);
    };
    return this.cacheService.getFromCacheOrGetAndCacheResult(`members-ranking-club:${season}:${club}`, getter, TTL_DURATION.EIGHT_HOURS);
  }

  async getMembersRankingFromTeam(club: string, teamId: string, season: number, sortingSystem: SortSystem = SortSystem.MOST_PLAYED): Promise<MemberResults[]> {
    // Télécharger les matchs
    const [divisionId] = teamId.split('-');
    const getter = async () => {
      const matches = await this.matchService.getMatches({
        Season: season,
        Club: club,
        DivisionId: Number(divisionId),
        WithDetails: true,
      });
      return MatchesMembersRankerService.computeRanking(matches, sortingSystem, club);
    };
    return this.cacheService.getFromCacheOrGetAndCacheResult(`members-ranking-team:${season}:${club}-${teamId}`, getter, TTL_DURATION.EIGHT_HOURS);
  }

  private static computeRanking(matches: TeamMatchesEntry[], sortingSystem: SortSystem, keepClub?: string): MemberResults[] {
    const players: Map<number, MemberResults> = new Map<number, MemberResults>();

    for (const match of matches) {
      if (match.MatchDetails.DetailsCreated) {
        const matchDetails = match.MatchDetails;
        const mapPlayer = (p: Player) => ({
          uniqueIndex: p.UniqueIndex,
          firstName: p.FirstName,
          lastName: p.LastName,
          ranking: p.Ranking,
        });
        const awayPlayers = (matchDetails.AwayPlayers?.Players ?? []).map(mapPlayer);
        const homePlayers = (matchDetails.HomePlayers?.Players ?? []).map(mapPlayer);
        const matchPlayers = [
          ...((keepClub && match.HomeClub === keepClub || !keepClub) ? homePlayers : []),
          ...((keepClub && match.AwayClub === keepClub || !keepClub) ? awayPlayers : []),
        ];

        for (const player of matchPlayers) {
          const playerEntry = players.get(player.uniqueIndex) ?? {
            uniqueIndex: player.uniqueIndex,
            firstName: player.firstName,
            lastName: player.lastName,
            ranking: player.ranking,
            played: 0,
            win: 0,
            lose: 0,
            winPourcentage: 0,
            losePourcentage: 0,
          };

          for (const individualMatch of matchDetails.IndividualMatchResults) {
            if (
              (individualMatch && individualMatch.AwayPlayerUniqueIndex?.includes(player.uniqueIndex) && !individualMatch.IsAwayForfeited && !individualMatch.IsHomeForfeited) ||
              (individualMatch && individualMatch.HomePlayerUniqueIndex?.includes(player.uniqueIndex) && !individualMatch.IsHomeForfeited && !individualMatch.IsAwayForfeited)
            ) {
              playerEntry.played = playerEntry.played + 1;

              if (
                (individualMatch.AwayPlayerUniqueIndex?.includes(player.uniqueIndex) && individualMatch.AwaySetCount > individualMatch.HomeSetCount) ||
                (individualMatch.HomePlayerUniqueIndex?.includes(player.uniqueIndex) && individualMatch.AwaySetCount < individualMatch.HomeSetCount)
              ) {
                playerEntry.win = playerEntry.win + 1;
              } else {
                playerEntry.lose = playerEntry.lose + 1;
              }
            }
          }
          players.set(player.uniqueIndex, playerEntry);
        }
      }
    }
    const results = [...players.values()];
    return MatchesMembersRankerService.computePctAndSort(results, sortingSystem);
  }

  private static computePctAndSort(members: MemberResults[], sortSystem: SortSystem): MemberResults[] {
    for (const result of members) {
      result.winPourcentage = Math.round((result.win / result.played) * 100);
      result.losePourcentage = Math.round((result.lose / result.played) * 100);
    }
    const mostPlayedCmpFct = (a: MemberResults, b: MemberResults) => ((a.played * 100) + a.winPourcentage) > ((b.played * 100) + b.winPourcentage) ? -1 : 1;
    const bestPerfPctCmpFct = (a: MemberResults, b: MemberResults) => ((a.winPourcentage * 100) + a.played) > ((b.winPourcentage * 100) + b.played) ? -1 : 1;
    const bestPerfWinCntCmpFct = (a: MemberResults, b: MemberResults) => a.win > b.win ? -1 : 1;
    let fctToApply;
    switch (sortSystem) {
      case SortSystem.BEST_PERF_PER_PCT:
        fctToApply = bestPerfPctCmpFct;
        break;
      case SortSystem.BEST_PERF_PER_WIN:
        fctToApply = bestPerfWinCntCmpFct;
        break;
      case SortSystem.MOST_PLAYED:
        fctToApply = mostPlayedCmpFct;
        break;
    }

    return members
      .filter((member) => member.played > 0)
      .sort(fctToApply);
  }

}
