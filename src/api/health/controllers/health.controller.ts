import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TestRequestService } from '../../../services/test/test-request.service';
import { TestOutput } from '../../../entity/tabt-soap/TabTAPI_Port';
import { TabtHeadersDecorator } from '../../../common/decorators/tabt-headers.decorator';
import { ContextService } from '../../../common/context/context.service';

@ApiTags('Health')
@Controller({
  path: 'health',
  version: '1'
})
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private healthIndicator: HttpHealthIndicator,
    private testRequest: TestRequestService,
    private contextService: ContextService,
  ) {
  }

  @Get()
  @ApiOperation({
    operationId: 'checkHealth',
  })
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.healthIndicator.pingCheck('AFTT API', 'https://resultats.aftt.be/api/?wsdl'),
      () => this.healthIndicator.pingCheck('VTTL API', 'https://api.vttl.be/?wsdl'),
    ]);
  }

  @Get('test')
  @ApiOperation({
    operationId: 'testRequest',
  })
  @ApiOkResponse({
    type: TestOutput,
    description: 'Test request',
  })
  @TabtHeadersDecorator()
  test() {
    return this.testRequest.testRequest();
  }

  @Get('context')
  @ApiOperation({
    operationId: 'context',
  })
  @TabtHeadersDecorator()
  context() {
    return this.contextService.context;
  }


}
