import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
} from '@nestjs/terminus';
import {
  Ctx,
  MessagePattern,
  Payload,
  RedisContext,
} from '@nestjs/microservices';

@Controller({
  path: 'health',
})
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private healthIndicator: HttpHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () =>
        this.healthIndicator.pingCheck(
          'AFTT webside accessible',
          'https://resultats.aftt.be/',
        ),
    ]);
  }

  @MessagePattern('notify')
  async notify(
    @Payload() data: { message: string },
    @Ctx() context: RedisContext,
  ) {
    console.log('Notification received', data.message, context);
    console.log(
      'Channel:',
      context.getChannel(),
      'Pattern:',
      context.getArgs(),
    );
    return 'Notification received';
  }
}
