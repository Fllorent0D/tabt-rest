import { MemberService } from '../../services/members/member.service';
import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { ServicesModule } from '../../services/services.module';
import { InternalIdentifiersController } from './controller/internal-identifiers.controller';

@Module({
  imports:[CommonModule, ServicesModule],
  controllers: [InternalIdentifiersController],
  providers: [MemberService]
})
export class InternalIdentifiersModule {}
