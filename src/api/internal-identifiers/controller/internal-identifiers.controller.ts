import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InternalIdentifiersDTO, RedirectLinkDTO, UniqueIdentifiersDTO } from '../dto/register.dto';
import { InternalIdMapperService } from '../../../services/id-mapper/internal-id-mapper.service';
import { ConfigService } from '@nestjs/config';

@ApiTags('Internal Identifiers')
@Controller('internal-identifiers')
export class InternalIdentifiersController {

  constructor(
    private readonly internalMapper: InternalIdMapperService,
    private readonly configService: ConfigService,
  ) {
  }

  @Get()
  @ApiOperation({
    operationId: 'getInternalIds',
  })
  @ApiOkResponse({
    type: InternalIdentifiersDTO,
    description: 'Get a internal id of player and club',
  })
  async findAll(
    @Query() input: UniqueIdentifiersDTO,
  ): Promise<InternalIdentifiersDTO> {
    const [playerId, clubId] = await Promise.all([
      this.internalMapper.getInternalPlayerId(input.playerUniqueIndex),
      this.internalMapper.getInternalClubId(input.clubUniqueIndex),
    ]);

    return {
      playerInternalIdentifier: playerId,
      clubInternalIdentifier: clubId,
    };
  }

  @Get('link')
  @ApiOperation({
    operationId: 'getRegisterLink',
  })
  @ApiOkResponse({
    type: RedirectLinkDTO,
    description: 'Get a redirect link to register a user',
  })
  async redirect(
    @Query() input: UniqueIdentifiersDTO,
  ): Promise<RedirectLinkDTO> {
    const [playerId, clubId] = await Promise.all([
      this.internalMapper.getInternalPlayerId(input.playerUniqueIndex),
      this.internalMapper.getInternalClubId(input.clubUniqueIndex),
    ]);

    return {
      url: this.configService.get<string>('HOST') + this.configService.get<string>('STATIC_PREFIX') + `/redirect-register.html?internalPlayerId=${playerId}&internalClubId=${clubId}`,
    };
  }
}
