import {
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Head2HeadData,
  Head2headService,
} from '../../../services/members/head2head.service';

@ApiTags('Head2Head')
@Controller({
  path: 'head2head',
  version: '1',
})
export class Head2headController {
  constructor(private h2hService: Head2headService) {}

  @Get(':playerUniqueIndex/:opponentUniqueIndex')
  @ApiOperation({
    operationId: 'findHead2HeadMatches',
  })
  @ApiOkResponse({
    description: 'List of all matches between 2 players',
    type: Head2HeadData,
  })
  async findAll(
    @Param('playerUniqueIndex', ParseIntPipe) playerA: number,
    @Param('opponentUniqueIndex', ParseIntPipe) playerB: number,
  ): Promise<Head2HeadData> {
    try {
      return this.h2hService.getHead2HeadResults(playerA, playerB);
    } catch (e) {
      throw new InternalServerErrorException(e, e.message);
    }
  }
}
