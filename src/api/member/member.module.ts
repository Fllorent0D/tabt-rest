import { MemberService } from '../../services/members/member.service';
import { MemberController } from './controllers/member.controller';
import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { ServicesModule } from '../../services/services.module';

@Module({
  imports:[CommonModule, ServicesModule],
  controllers: [MemberController],
  providers: [MemberService]
})
export class MemberModule {}
