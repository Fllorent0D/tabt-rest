import { Controller, Get, NotFoundException, Param, ParseIntPipe, Query } from '@nestjs/common';
import { GetMembersInput, MemberEntry } from '../../entity/tabt/TabTAPI_Port';
import { ApiNotFoundResponse, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MemberService } from '../providers/member.service';

@ApiTags('Members')
@Controller('members')
export class MemberController {

  constructor(
    private memberService: MemberService,
  ) {
  }

  @Get()
  @ApiOkResponse({
    type: [MemberEntry],
    description: 'List of players found with specific search criterias'
  })
  async findAll(@Query() input: GetMembersInput): Promise<MemberEntry[]> {
    return this.memberService.getMembers(input);
  }

  @Get(':UniqueIndex')
  @ApiOkResponse({
    type: MemberEntry,
    description: 'The information of a specific player',
  })
  @ApiNotFoundResponse()
  async findById(
    @Query() input: GetMembersInput,
    @Param('UniqueIndex', ParseIntPipe) id: number,
  ): Promise<MemberEntry> {
    const found = await this.memberService.getMembers({ ...input, UniqueIndex: id });
    if (found.length === 1) {
      return found[0];
    }
    throw new NotFoundException();
  }

}
