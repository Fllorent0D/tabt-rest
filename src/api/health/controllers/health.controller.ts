import { Controller, Get } from '@nestjs/common';
import { DNSHealthIndicator, HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TestRequestService } from '../../../services/test/test-request.service';
import { MemberEntry, TestOutput } from '../../../entity/tabt-soap/TabTAPI_Port';
import { TabtHeadersDecorator } from '../../../common/decorators/tabt-headers.decorator';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private dns: DNSHealthIndicator,
    private testRequest: TestRequestService
  ) {}

  @Get()
  @ApiOperation({
    operationId: 'checkHealth'
  })
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.dns.pingCheck('AFTT API', 'https://resultats.aftt.be/api/?wsdl'),
      () => this.dns.pingCheck('VTTL API', 'https://api.vttl.be/?wsdl'),
    ]);
  }

  @Get('test')
  @ApiOperation({
    operationId: 'testRequest'
  })
  @ApiOkResponse({
    type: TestOutput,
    description: 'Test request',
  })
  @TabtHeadersDecorator()
  test() {
    return this.testRequest.testRequest();
  }


}
