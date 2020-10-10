import { MemberService } from './providers/member.service';
import { MemberController } from './controllers/member.controller';
import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [MemberController],
  providers: [MemberService]
})
export class MemberModule {}
