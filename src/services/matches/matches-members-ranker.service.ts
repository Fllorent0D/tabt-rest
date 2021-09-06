import { Injectable } from '@nestjs/common';
import { Player, TeamMatchesEntry } from '../../entity/tabt-soap/TabTAPI_Port';
import { MatchService } from './match.service';
import { CacheService, TTL_DURATION } from '../../common/cache/cache.service';
import { MemberResults } from '../../common/dto/member-ranking.dto';


@Injectable()
export class MatchesMembersRankerService {
  constructor(
    private matchService: MatchService,
    private cacheService: CacheService,
  ) {
  }

  async getMembersRankingFromDivision(divisionId: number, season: number): Promise<MemberResults[]> {
    // Télécharger les matchs
    const getter = async () => {
      const matches = await this.matchService.getMatches({
        Season: season,
        DivisionId: divisionId,
        WithDetails: true,
      });

      return this.computeRanking(matches);
    };
    return this.cacheService.getFromCacheOrGetAndCacheResult(`members-ranking-division-${divisionId}-${season}`, getter, TTL_DURATION.EIGHT_HOURS);
  }

  async getMembersRankingFromClub(club: string, season: number): Promise<MemberResults[]> {
    // Télécharger les matchs
    const getter = async () => {
      const matches = await this.matchService.getMatches({
        Season: season,
        Club: club,
        WithDetails: true,
      });

      return this.computeRanking(matches, club);
    };
    return this.cacheService.getFromCacheOrGetAndCacheResult(`members-ranking-club-${club}-${season}`, getter, TTL_DURATION.EIGHT_HOURS);
  }

  async getMembersRankingFromTeam(club: string, teamId: string, season: number): Promise<MemberResults[]> {
    // Télécharger les matchs
    const [divisionId] = teamId.split('-');
    const getter = async () => {
      const matches = await this.matchService.getMatches({
        Season: season,
        Club: club,
        DivisionId: Number(divisionId),
        WithDetails: true,
      });

      return this.computeRanking(matches, club);
    };
    return this.cacheService.getFromCacheOrGetAndCacheResult(`members-ranking-team-${club}-${teamId}-${season}`, getter, TTL_DURATION.EIGHT_HOURS);
  }

  computeRanking(matches: TeamMatchesEntry[], keepClub?: string): MemberResults[] {
    const players: Map<number, MemberResults> = new Map<number, MemberResults>();

    for (const match of matches) {
      if (match.MatchDetails.DetailsCreated) {
        console.log(match.MatchId);
        const matchDetails = match.MatchDetails;
        const mapPlayer = (p: Player) => ({
          uniqueIndex: p.UniqueIndex,
          firstName: p.FirstName,
          lastName: p.LastName,
          ranking: p.Ranking,
        });
        const awayPlayers = matchDetails.AwayPlayers.Players.map(mapPlayer);
        const homePlayers = matchDetails.HomePlayers.Players.map(mapPlayer);
        const matchPlayers = [
          ...((keepClub && match.HomeClub === keepClub || !keepClub) ? homePlayers : []),
          ...((keepClub && match.AwayClub === keepClub || !keepClub) ? awayPlayers : []),
        ];

        for (const player of matchPlayers) {
          console.log(player);
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
              (individualMatch.AwayPlayerUniqueIndex.includes(player.uniqueIndex) && !individualMatch.IsAwayForfeited && !individualMatch.IsHomeForfeited) ||
              (individualMatch.HomePlayerUniqueIndex.includes(player.uniqueIndex) && !individualMatch.IsHomeForfeited && !individualMatch.IsAwayForfeited)
            ) {
              playerEntry.played = playerEntry.played + 1;

              if (
                (individualMatch.AwayPlayerUniqueIndex.includes(player.uniqueIndex) && individualMatch.AwaySetCount > individualMatch.HomeSetCount) ||
                (individualMatch.HomePlayerUniqueIndex.includes(player.uniqueIndex) && individualMatch.AwaySetCount < individualMatch.HomeSetCount)
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
    return this.computePctAndSort(results);
  }

  private computePctAndSort(members: MemberResults[]): MemberResults[] {
    for (const result of members) {
      result.winPourcentage = Math.round((result.win / result.played) * 100);
      result.losePourcentage = Math.round((result.lose / result.played) * 100);
    }
    return members
      .filter((member) => member.played > 0)
      .sort((a, b) => ((a.played * 100) + a.winPourcentage) > ((b.played * 100) + b.winPourcentage) ? -1 : 1);
  }

}
