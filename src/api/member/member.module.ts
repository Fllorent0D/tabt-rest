import { MemberService } from './providers/member.service';
import { MemberController } from './controllers/member.controller';
import { Module } from '@nestjs/common';
import { ProvidersModule } from '../../providers/providers.module';

@Module({
  imports: [ProvidersModule],
  controllers: [MemberController],
  providers: [MemberService]
})
export class MemberModule {}
