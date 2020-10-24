import { Test, TestingModule } from '@nestjs/testing';
import { DivisionsController } from './divisions.controller';
import { DivisionService } from '../../../services/divisions/division.service';
import { DivisionRankingService } from '../../../services/divisions/division-ranking.service';
import { MatchService } from '../../../services/matches/match.service';
import { GetDivisionMatches, GetDivisionRanking, GetDivisions } from '../dto/divisions.dto';
import { NotFoundException } from '@nestjs/common';

jest.mock('../../../services/matches/match.service');
jest.mock('../../../services/divisions/division.service');
jest.mock('../../../services/divisions/division-ranking.service');

describe('DivisionsController', () => {
  let controller: DivisionsController;
  let divisionService: DivisionService;
  let divisionRankingService: DivisionRankingService;
  let matchService: MatchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DivisionsController],
      providers: [DivisionService, DivisionRankingService, MatchService],
    }).compile();

    controller = module.get<DivisionsController>(DivisionsController);
    divisionService = module.get<DivisionService>(DivisionService);
    matchService = module.get<MatchService>(MatchService);
    divisionRankingService = module.get<DivisionRankingService>(DivisionRankingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Divisions', () => {
    it('should call division service with correct params', async () => {
      const input: GetDivisions = {
        level: 'NATIONAL',
        showDivisionName: 'yes',
        season: 18,
      };

      const spy = jest.spyOn(divisionService, 'getDivisions');

      const result = await controller.findAll(input);

      expect(result).toBeDefined();
      expect(result[0]).toBeDefined();
      expect(spy).toHaveBeenCalledWith({
        Season: 18,
        Level: 1,
        ShowDivisionName: 'yes',
      });
    });

    it('should call division service with correct params for 1 division', async () => {
      const input: GetDivisions = {
        showDivisionName: 'yes',
        season: 18,
      };

      const spy = jest.spyOn(divisionService, 'getDivisionsById');

      const result = await controller.findOne(12, input);

      expect(result).toBeDefined();
      expect(spy).toHaveBeenCalledWith(12, {
        Season: 18,
        ShowDivisionName: 'yes',
      });
    });

    it('should return 404 when division id is not found', async () => {
      const input: GetDivisions = {
        showDivisionName: 'yes',
        season: 18,
      };

      jest.spyOn(divisionService, 'getDivisionsById').mockResolvedValue(null);

      expect(controller.findOne(12, input)).rejects.toEqual(new NotFoundException());

    });
  });
  describe('Division ranking', () => {
    it('should call division ranking service with correct params', async () => {
      const input: GetDivisionRanking = {
        weekName: '1',
        rankingSystem: 1,
      };

      const spy = jest.spyOn(divisionRankingService, 'getDivisionRanking');

      const result = await controller.findRankingDivision(4755, input);

      expect(result).toBeDefined();
      expect(result[0]).toBeDefined();
      expect(spy).toHaveBeenCalledWith({
        'DivisionId': 4755,
        'RankingSystem': 1,
        'WeekName': '1',
      });
    });
  });
  describe('Division matches', () => {
    it('should call match service with correct params', async () => {
      const input: GetDivisionMatches = {
        weekName: '1',
        yearDateFrom: '1995-12-13',
        yearDateTo: '1995-12-14',
        withDetails: true,
      };

      const spy = jest.spyOn(matchService, 'getMatches');

      const result = await controller.findMatchesDivision(4755, input);

      expect(result).toBeDefined();
      expect(result[0]).toBeDefined();
      expect(spy).toHaveBeenCalledWith({
        'DivisionId': 4755,
        'WeekName': '1',
        'WithDetails': true,
        'YearDateFrom': '1995-12-13',
        'YearDateTo': '1995-12-14',
      });
    });
  });
});
