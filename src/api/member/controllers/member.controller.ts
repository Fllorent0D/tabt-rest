import { Controller, Get, NotFoundException, Param, ParseIntPipe, Query } from '@nestjs/common';
import { Credentials, GetMembersInput, MemberEntry } from '../../../entity/tabt/TabTAPI_Port';
import { ApiNotFoundResponse, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MemberService } from '../providers/member.service';
import { TabtHeaders } from '../../../common/headers/tabt-headers';
import { TabtCredentials } from '../../../common/decorators/TabtCredentials.decorator';

@ApiTags('Members')
@Controller('members')
@TabtHeaders()
export class MemberController {

  constructor(
    private memberService: MemberService,
  ) {
  }

  @Get()
  @ApiOkResponse({
    type: [MemberEntry],
    description: 'List of players found with specific search criterias',
  })
  async findAll(
    @Query() input: GetMembersInput,
    @TabtCredentials() credentials: Credentials,
  ): Promise<MemberEntry[]> {
    return this.memberService.getMembers({ ...input, Credentials: credentials });
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
    @TabtCredentials() credentials: Credentials,
  ): Promise<MemberEntry> {
    const found = await this.memberService.getMembers({ ...input, UniqueIndex: id, Credentials: credentials });
    if (found.length === 1) {
      return found[0];
    }
    throw new NotFoundException();
  }

}
