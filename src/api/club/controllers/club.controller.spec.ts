import { Test, TestingModule } from '@nestjs/testing';
import { ClubController } from './club.controller';
import { ClubService } from '../../../services/clubs/club.service';
import { ClubTeamService } from '../../../services/clubs/club-team.service';
import { ClubMemberService } from '../../../services/clubs/club-member.service';
import { GetMembersFromClub, ListAllClubs } from '../dto/club.dto';
import { RequestBySeason } from '../../../common/dto/RequestBySeason';
import { NotFoundException } from '@nestjs/common';

jest.mock('../../../services/clubs/club.service');
jest.mock('../../../services/clubs/club-member.service');
jest.mock('../../../services/clubs/club-team.service');

describe('ClubController', () => {
  let controller: ClubController;
  let clubService: ClubService;
  let clubTeamService: ClubTeamService;
  let clubMemberService: ClubMemberService;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClubController],
      providers: [ClubService, ClubTeamService, ClubMemberService],
    }).compile();

    controller = module.get<ClubController>(ClubController);
    clubMemberService = module.get<ClubMemberService>(ClubMemberService);
    clubTeamService = module.get<ClubTeamService>(ClubTeamService);
    clubService = module.get<ClubService>(ClubService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });


  describe('findAll', () => {
    it('should call club service with correct params', async () => {
      const input: ListAllClubs = { season: 18, clubCategory: 'LIEGE' };

      const getAllClubSpy = jest.spyOn(clubService, 'getClubs');


      const response = await controller.findAll(input);
      expect(response).toBeDefined();
      expect(response[0]).toBeDefined();
      expect(getAllClubSpy).toHaveBeenCalledWith({ 'ClubCategory': 10, 'Season': 18 });
    });
  });

  describe('findbyId', () => {
    it('should call club service with correct params', async () => {
      const input: RequestBySeason = { season: 18 };

      const getAllClubSpy = jest.spyOn(clubService, 'getClubById');

      const response = await controller.findbyId('L360', input);

      expect(response).toBeDefined();
      expect(getAllClubSpy).toHaveBeenCalledWith({ 'Season': 18 }, 'L360');
    });

    it('should throw an exeption if not found', async () => {
      const input: RequestBySeason = { season: 18 };

      jest.spyOn(clubService, 'getClubById').mockResolvedValue(null);

      // Weird syntaxt... ToThrown is not supported with async/await
      expect(controller.findbyId('L360', input)).rejects.toEqual(new NotFoundException());
    });
  });

  describe('getClubMembers', () => {
    it('should call club members service with correct params', async () => {
      const input: GetMembersFromClub = {
        season: 18,
        playerCategory: 'MEN',
        uniqueIndex: 142453,
        nameSearch: 'Florent',
        extendedInformation: true,
        rankingPointsInformation: true,
        withOpponentRankingEvaluation: false,
        withResults: true,
      };
      const getClubMembersSpy = jest.spyOn(clubMemberService, 'getClubsMembers');

      const response = await controller.getClubMembers(input, 'L360');

      expect(response).toBeDefined();
      expect(getClubMembersSpy).toHaveBeenCalledWith({
        'Club': 'L360',
        'ExtendedInformation': true,
        'NameSearch': 'Florent',
        'PlayerCategory': 1,
        'RankingPointsInformation': true,
        'Season': 18,
        'UniqueIndex': 142453,
        'WithOpponentRankingEvaluation': false,
        'WithResults': true,
      });
    });
  });

  describe('getClubTeams', () => {
    it('should call club teams service with correct params', async () => {
      const input: RequestBySeason = { season: 18 };

      const getAllTeamsSpy = jest.spyOn(clubTeamService, 'getClubsTeams');

      const response = await controller.getClubTeams(input, 'L360');

      expect(response).toBeDefined();
      expect(getAllTeamsSpy).toHaveBeenCalledWith({ 'Season': 18, 'Club': 'L360' });
    });
  });


});
