import { Module } from '@nestjs/common';
import { UserAgentController } from './user-agent.controller';

@Module({
  imports: [],
  controllers: [UserAgentController],
})
export class UserAgentModule {
}
