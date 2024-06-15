import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          timeout: 30000,
          baseURL: configService.get('AFTT_DATA_BASE_URL'),
          auth: {
            username: configService.get('AFTT_DATA_USERNAME'),
            password: configService.get('AFTT_DATA_PASSWORD'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [PrismaService],
  exports: [HttpModule, PrismaService],
})
export class CommonModule {}
