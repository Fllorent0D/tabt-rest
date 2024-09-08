import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Version,
} from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DivisionDashboardDTOV1 } from '../dto/division-dashboard.dto';
import { DivisionDashboardService } from '../services/division-dashboard.service';

@ApiTags('DivisionDashboards')
@Controller({
  path: 'dashboard/division',
  version: '1',
})
export class DivisionDashboardController {
  constructor(
    private readonly divisionDashboardService: DivisionDashboardService,
  ) {}

  @Get(':divisionId')
  @ApiOkResponse({
    type: DivisionDashboardDTOV1,
    description: 'The information to be displayed on the division dashboard',
  })
  @ApiNotFoundResponse({
    description: 'No info found for given division',
  })
  @Version('1')
  async memberDashboardV1(
    @Param('divisionId', ParseIntPipe) id: number,
  ): Promise<DivisionDashboardDTOV1> {
    const divisionDashboardDTOV1 =
      await this.divisionDashboardService.getDashboard(id);
    if (!divisionDashboardDTOV1) {
      throw new NotFoundException(`No division found for id ${id}`);
    }
    return divisionDashboardDTOV1;
  }
}
