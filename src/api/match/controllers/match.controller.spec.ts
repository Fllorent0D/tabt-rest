import { Test, TestingModule } from '@nestjs/testing';
import { MatchController } from './match.controller';
import { MatchService } from '../../../services/matches/match.service';
import { MatchSystemService } from '../../../services/matches/match-system.service';
import { GetMatch, GetMatches } from '../dto/match.dto';
import { NotFoundException } from '@nestjs/common';

jest.mock('../../../services/matches/match.service');
jest.mock('../../../services/matches/match-system.service');

describe('MatchController', () => {
  let controller: MatchController;
  let matchService: MatchService;
  let matchSystemService: MatchSystemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchController],
      providers: [MatchService, MatchSystemService],
    }).compile();

    controller = module.get<MatchController>(MatchController);
    matchService = module.get<MatchService>(MatchService);
    matchSystemService = module.get<MatchSystemService>(MatchSystemService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('matches', () => {
    it('should call match service with correct params', async () => {
      const input: GetMatches = {
        divisionId: 1,
        club: 'azz',
        team: 'aze',
        divisionCategory: 'MEN',
        weekName: '1',
        level: 'NATIONAL',
        showDivisionName: 'no',
        yearDateFrom: '1995-10-17',
        yearDateTo: '1995-10-17',
        matchId: 'abc',
        matchUniqueId: '1234',
        withDetails: true,
      };

      const spy = jest.spyOn(matchService, 'getMatches');

      const result = await controller.findAll(input);


      expect(result).toBeDefined();
      expect(result[0]).toBeDefined();
      expect(spy).toHaveBeenCalledWith({
        'Club': 'azz',
        'DivisionCategory': 1,
        'DivisionId': 1,
        'Level': 1,
        'MatchId': 'abc',
        'MatchUniqueId': '1234',
        'ShowDivisionName': 'no',
        'Team': 'aze',
        'WeekName': '1',
        'WithDetails': true,
        'YearDateFrom': '1995-10-17',
        'YearDateTo': '1995-10-17',
      });
    });
    it('should call match service with correct params to find 1 match', async () => {
      const input: GetMatch = {
        divisionId: 1,
        club: 'azz',
        team: 'aze',
        divisionCategory: 'MEN',
        weekName: '1',
        level: 'NATIONAL',
        showDivisionName: 'no',
        yearDateFrom: '1995-10-17',
        yearDateTo: '1995-10-17',
        matchId: 'abc',
        withDetails: true,
      };

      const spy = jest.spyOn(matchService, 'getMatches');

      const result = await controller.findById(input, 1234);

      expect(result).toBeDefined();
      expect(spy).toHaveBeenCalledWith({
        'Club': 'azz',
        'DivisionCategory': 1,
        'DivisionId': 1,
        'Level': 1,
        'MatchId': 'abc',
        'MatchUniqueId': 1234,
        'ShowDivisionName': 'no',
        'Team': 'aze',
        'WeekName': '1',
        'WithDetails': true,
        'YearDateFrom': '1995-10-17',
        'YearDateTo': '1995-10-17',
      });

    });
    it('should thrown an 404 exception if match is not found', async () => {
      const input: GetMatch = {};

      jest.spyOn(matchService, 'getMatches').mockResolvedValue([]);

      expect(controller.findById(input, 1234)).rejects.toEqual(new NotFoundException());
    });
  });

  describe('match systems', () => {
    it('should call match system service', async () => {
      const spy = jest.spyOn(matchSystemService, 'getMatchSystems');

      const result = await controller.findMatchSystem();


      expect(result).toBeDefined();
      expect(result[0]).toBeDefined();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call match system service and return one', async () => {
      const spy = jest.spyOn(matchSystemService, 'getMatchSystemsById');

      const result = await controller.findMatchSystemById(1);

      expect(typeof result).toBe('object');
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(1);
    });

    it('should call match system service and return 404 if not found', async () => {
      jest.spyOn(matchSystemService, 'getMatchSystemsById').mockResolvedValue(null);

      expect(controller.findMatchSystemById(1)).rejects.toEqual(new NotFoundException());
    });
  });
});
