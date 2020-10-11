import { Module } from '@nestjs/common';
import { SeasonController } from './controllers/season.controller';
import { SeasonService } from './providers/season.service';
import { CommonModule } from '../../common/common.module';

@Module({
  imports:[CommonModule],
  controllers: [SeasonController],
  providers: [SeasonService]
})
export class SeasonModule {}
