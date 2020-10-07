import { Module } from '@nestjs/common';
import { SeasonController } from './controllers/season.controller';
import { SeasonService } from './providers/season.service';
import { ProvidersModule } from '../providers/providers.module';

@Module({
  imports:[ProvidersModule],
  controllers: [SeasonController],
  providers: [SeasonService]
})
export class SeasonModule {}
