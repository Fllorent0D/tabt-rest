import { Controller, Get } from '@nestjs/common';
import { UserAgentsUtil } from '../../common/utils/user-agents.util';

@Controller({
  path: 'user-agent',
  version: '1',
})
export class UserAgentController {
  @Get('random')
  generateRandomUserAgent() {
    return { ua: UserAgentsUtil.random };
  }
}
