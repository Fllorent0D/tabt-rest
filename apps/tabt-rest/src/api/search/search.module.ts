import { Module } from '@nestjs/common';
import { SearchService } from '../../services/search/search.service';
import { CommonModule } from '../../common/common.module';
import { ServicesModule } from '../../services/services.module';
import { SearchController } from './controllers/search.controller';

@Module({
  imports: [CommonModule, ServicesModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
