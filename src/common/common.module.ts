import { Module } from '@nestjs/common';
import { MiddlewareModule } from './middleware/middleware.module';

@Module({
  imports: [MiddlewareModule]
})
export class CommonModule {}
