import { Controller, Get, NotFoundException, Param, ParseIntPipe, Query } from '@nestjs/common';
import { MemberEntry } from '../../../entity/tabt-soap/TabTAPI_Port';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MemberService } from '../../../services/members/member.service';
import { TabtHeadersDecorator } from '../../../common/decorators/tabt-headers.decorator';
import { GetMember, GetMembers } from '../dto/member.dto';
import { PlayerCategory } from '../../../entity/tabt-input.interface';

@ApiTags('Members')
@Controller('members')
@TabtHeadersDecorator()
export class MemberController {

  constructor(
    private memberService: MemberService,
  ) {
  }

  @Get()
  @ApiOperation({
    operationId: 'findAllMembers'
  })
  @ApiOkResponse({
    type: [MemberEntry],
    description: 'List of players found with specific search criterias',
  })
  async findAll(
    @Query() input: GetMembers,
  ): Promise<MemberEntry[]> {
    return this.memberService.getMembers(
      {
        Club: input.club,
        PlayerCategory: PlayerCategory[input.playerCategory],
        UniqueIndex: input.uniqueIndex,
        NameSearch: input.nameSearch,
        ExtendedInformation: input.extendedInformation,
        RankingPointsInformation: input.rankingPointsInformation,
        WithResults: input.withResults,
        WithOpponentRankingEvaluation: input.withOpponentRankingEvaluation,
      }
    );
  }

  @Get(':uniqueIndex')
  @ApiOkResponse({
    type: MemberEntry,
    description: 'The information of a specific player',
  })
  @ApiOperation({
    operationId: 'findMemberById'
  })
  @ApiNotFoundResponse()
  async findById(
    @Query() input: GetMember,
    @Param('uniqueIndex', ParseIntPipe) id: number,
  ): Promise<MemberEntry> {
    const found = await this.memberService.getMembers({
      Club: input.club,
      PlayerCategory: PlayerCategory[input.playerCategory],
      UniqueIndex: id,
      NameSearch: input.nameSearch,
      ExtendedInformation: input.extendedInformation,
      RankingPointsInformation: input.rankingPointsInformation,
      WithResults: input.withResults,
      WithOpponentRankingEvaluation: input.withOpponentRankingEvaluation,
    });
    if (found.length === 1) {
      return found[0];
    }
    throw new NotFoundException();
  }

}
