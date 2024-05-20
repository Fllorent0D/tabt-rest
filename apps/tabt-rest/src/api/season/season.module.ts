import { Module } from '@nestjs/common';
import { SeasonController } from './controllers/season.controller';
import { SeasonService } from '../../services/seasons/season.service';
import { CommonModule } from '../../common/common.module';
import { ServicesModule } from '../../services/services.module';

@Module({
  imports: [CommonModule, ServicesModule],
  controllers: [SeasonController],
  providers: [SeasonService],
})
export class SeasonModule {
}
