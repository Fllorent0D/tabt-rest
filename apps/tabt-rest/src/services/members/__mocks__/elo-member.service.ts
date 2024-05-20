import { Injectable } from '@nestjs/common';
import { WeeklyELO, WeeklyNumericRanking } from '../../../api/member/dto/member.dto';
import { PlayerCategory } from '../../../entity/tabt-input.interface';

@Injectable()
export class EloMemberService {


  public async getEloWeekly(playerId: number, season: number): Promise<WeeklyELO[]> {
    return Promise.resolve([
        {
          'weekName': '2021-10-02',
          'elo': 1231,
        },
      ],
    );
  }

  public async getBelNumericRanking(playerId: number, season: number, category: PlayerCategory = PlayerCategory.MEN): Promise<WeeklyNumericRanking[]> {
    return Promise.resolve([
      {
        'weekName': '2021-10-02',
        'elo': 1231,
        'bel': 737,
      },
    ]);
  }

}
