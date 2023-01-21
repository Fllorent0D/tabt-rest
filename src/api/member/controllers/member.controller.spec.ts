import { Test, TestingModule } from '@nestjs/testing';
import { MemberController } from './member.controller';
import { MemberService } from '../../../services/members/member.service';
import { GetMember, PLAYER_CATEGORY, WeeklyNumericRanking, WeeklyNumericRankingInput } from '../dto/member.dto';
import { NotFoundException } from '@nestjs/common';
import { SeasonService } from '../../../services/seasons/season.service';
import { EloMemberService } from '../../../services/members/elo-member.service';
import { PlayerCategory } from '../../../entity/tabt-input.interface';
import { MembersSearchIndexService } from '../../../services/members/members-search-index.service';
import { MemberCategoryService } from '../../../services/members/member-category.service';

jest.mock('../../../services/members/member.service');
jest.mock('../../../services/seasons/season.service');
jest.mock('../../../services/members/elo-member.service');
jest.mock('../../../services/members/members-search-index.service');
jest.mock('../../../services/members/member-category.service');

describe('MemberController', () => {
  let controller: MemberController;
  let service: MemberService;
  let eloService: EloMemberService;
  let seasonService: SeasonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberController],
      providers: [MemberService, SeasonService, EloMemberService, MembersSearchIndexService, MemberCategoryService],
    }).compile();

    controller = module.get<MemberController>(MemberController);
    service = module.get<MemberService>(MemberService);
    eloService = module.get<EloMemberService>(EloMemberService);
    seasonService = module.get<SeasonService>(SeasonService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call members service with correct param', async () => {
    const input = {
      club: 'L360',
      uniqueIndex: 142453,
      extendedInformation: 'true',
      nameSearch: 'florent',
      playerCategory: 'MEN',
      rankingPointsInformation: 'true',
      withOpponentRankingEvaluation: 'true',
      withResults: 'true',
    };
    const spy = jest.spyOn(service, 'getMembers');

    const result = await controller.findAll(input as unknown as GetMember);

    expect(result).toBeDefined();
    expect(result[0]).toBeDefined();
    expect(spy).toHaveBeenCalledWith({
      'Club': 'L360',
      'ExtendedInformation': true,
      'NameSearch': 'florent',
      'PlayerCategory': 1,
      'RankingPointsInformation': true,
      'UniqueIndex': 142453,
      'WithOpponentRankingEvaluation': true,
      'WithResults': true,
    });
  });

  it('should call members service with correct param - 1 player', async () => {
    const input = {
      club: 'L360',
      extendedInformation: 'true',
      nameSearch: 'florent',
      playerCategory: 'MEN',
      rankingPointsInformation: 'true',
      withOpponentRankingEvaluation: 'true',
      withResults: 'true',
    };
    const spy = jest.spyOn(service, 'getMembers');

    const result = await controller.findById(input as unknown as GetMember, 142453);

    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
    expect(spy).toHaveBeenCalledWith({
      'Club': 'L360',
      'ExtendedInformation': true,
      'NameSearch': 'florent',
      'PlayerCategory': 1,
      'RankingPointsInformation': true,
      'UniqueIndex': 142453,
      'WithOpponentRankingEvaluation': true,
      'WithResults': true,
    });

  });

  it('should throw 404 exeption if not found', async () => {
    const input: GetMember = {};
    jest.spyOn(service, 'getMembers').mockResolvedValue([]);

    await expect(controller.findById(input, 142453)).rejects.toEqual(new NotFoundException());
  });
  describe('Member numeric rankings', () => {
    it('should throw 404 exeption if not found', async () => {
      const input: WeeklyNumericRankingInput = {
        season: 18,
        category: PLAYER_CATEGORY.MEN,
      };
      jest.spyOn(eloService, 'getBelNumericRanking').mockResolvedValue([]);

      await expect(controller.findNumericRankings(123, input)).rejects.toEqual(new NotFoundException('No ELO points found'));
      expect(eloService.getBelNumericRanking).toHaveBeenCalledWith(123, 18, PlayerCategory.MEN);
    });

    it('should return numeric rankings if found', async () => {
      const input: WeeklyNumericRankingInput = {};
      const expectedResult: WeeklyNumericRanking[] = [{ weekName: '12/12/2021', bel: 123, elo: 123 }];
      jest.spyOn(eloService, 'getBelNumericRanking').mockResolvedValue(expectedResult);
      jest.spyOn(seasonService, 'getCurrentSeason').mockResolvedValue({ Season: 18, IsCurrent: true, Name: '2018' });
      const result = await controller.findNumericRankings(123, input);
      expect(result).toBe(expectedResult);
      expect(eloService.getBelNumericRanking).toHaveBeenCalledWith(123, 18, PlayerCategory.MEN);
    });
  });
});
