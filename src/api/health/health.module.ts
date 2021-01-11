import { Module } from '@nestjs/common';
import { HealthController } from './controllers/health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { CommonModule } from '../../common/common.module';
import { ServicesModule } from '../../services/services.module';

@Module({
  imports: [TerminusModule, CommonModule, ServicesModule],
  controllers: [HealthController]
})
export class HealthModule {}
