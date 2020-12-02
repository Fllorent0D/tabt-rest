import { Controller, Get } from '@nestjs/common';
import { DNSHealthIndicator, HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private dns: DNSHealthIndicator,
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
}
