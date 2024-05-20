import { MemberService } from '../../services/members/member.service';
import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { ServicesModule } from '../../services/services.module';
import { InternalIdentifiersController } from './controller/internal-identifiers.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [CommonModule, ServicesModule, ConfigModule],
  controllers: [InternalIdentifiersController],
  providers: [MemberService],
})
export class InternalIdentifiersModule {
}
