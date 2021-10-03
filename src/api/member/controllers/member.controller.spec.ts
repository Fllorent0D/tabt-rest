import { Test, TestingModule } from '@nestjs/testing';
import { MemberController } from './member.controller';
import { MemberService } from '../../../services/members/member.service';
import { GetMember, GetMembers } from '../dto/member.dto';
import { NotFoundException } from '@nestjs/common';

jest.mock('../../../services/members/member.service');

describe('MemberController', () => {
  let controller: MemberController;
  let service: MemberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberController],
      providers: [MemberService],
    }).compile();

    controller = module.get<MemberController>(MemberController);
    service = module.get<MemberService>(MemberService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call members service with correct param', async () => {
    const input: GetMembers = {
      club: 'L360',
      uniqueIndex: 142453,
      extendedInformation: true,
      nameSearch: 'florent',
      playerCategory: 'MEN',
      rankingPointsInformation: true,
      withOpponentRankingEvaluation: true,
      withResults: true,
    };
    const spy = jest.spyOn(service, 'getMembers');

    const result = await controller.findAll(input);

    expect(result).toBeDefined();
    expect(result[0]).toBeDefined();
    expect(spy).toHaveBeenCalledWith({
      'Club': 'L360',
      'ExtendedInformation': true,
      'NameSearch': 'florent',
      'PlayerCategory': 1,
      'RankingPointsInformation': true,
      'Season': 18,
      'UniqueIndex': 142453,
      'WithOpponentRankingEvaluation': true,
      'WithResults': true,
    });
  });

  it('should call members service with correct param - 1 player', async () => {
    const input: GetMember = {
      club: 'L360',
      extendedInformation: true,
      nameSearch: 'florent',
      playerCategory: 'MEN',
      rankingPointsInformation: true,
      withOpponentRankingEvaluation: true,
      withResults: true,
    };
    const spy = jest.spyOn(service, 'getMembers');

    const result = await controller.findById(input, 142453);

    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
    expect(spy).toHaveBeenCalledWith({
      'Club': 'L360',
      'ExtendedInformation': true,
      'NameSearch': 'florent',
      'PlayerCategory': 1,
      'RankingPointsInformation': true,
      'Season': 18,
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
});
