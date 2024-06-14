import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
  Version,
} from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  MemberDashboardDTOV1,
  WeeklyNumericRankingInputV2,
} from '../dto/member-dashboard.dto';
import { MemberDashboardService } from '../services/member-dashboard.service';

@ApiTags('Dashboards')
@Controller({
  path: 'dashboard/member',
  version: '1',
})
export class MemberDashboardController {
  constructor(
    private readonly memberDashboardService: MemberDashboardService,
  ) {}

  @Get(':uniqueIndex')
  @ApiOkResponse({
    type: MemberDashboardDTOV1,
    description: 'The information to be displayed on the members dashboard',
  })
  @ApiNotFoundResponse({
    description: 'No info found for given player',
  })
  @Version('1')
  async memberDashboardV1(
    @Param('uniqueIndex', ParseIntPipe) id: number,
    @Query() params: WeeklyNumericRankingInputV2,
  ): Promise<MemberDashboardDTOV1> {
    const memberDashboard = await this.memberDashboardService.getDashboard(
      id,
      params.category,
    );
    if (!memberDashboard) {
      throw new NotFoundException(`No member found for id ${id}`);
    }
    return memberDashboard;
  }
}
