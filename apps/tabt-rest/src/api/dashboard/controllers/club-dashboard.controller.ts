import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Version,
} from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ClubDashboardDTOV1 } from '../dto/club-dashboard.dto';
import { ClubDashboardService } from '../services/club-dashboard.service';

@ApiTags('Dashboards')
@Controller({
  path: 'dashboard/club',
  version: '1',
})
export class ClubDashboardController {
  constructor(private readonly clubDashboardService: ClubDashboardService) {}

  @Get(':uniqueIndex')
  @ApiOkResponse({
    type: ClubDashboardDTOV1,
    description: 'The information to be displayed on the club dashboard',
  })
  @ApiNotFoundResponse({
    description: 'No info found for given club',
  })
  @Version('1')
  async clubDashboardV1(
    @Param('uniqueIndex') id: string,
  ): Promise<ClubDashboardDTOV1> {
    const clubDasboard = await this.clubDashboardService.getDashboard(id);
    if (!clubDasboard) {
      throw new NotFoundException(`No member found for id ${id}`);
    }
    return clubDasboard;
  }
}
