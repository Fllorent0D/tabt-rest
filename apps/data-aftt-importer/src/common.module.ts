import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheModuleOptsFactory } from '../../tabt-rest/src/common/cache/cache-module-opts.factory';
import { CacheService } from './cache/cache.service';

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
    CacheModule.registerAsync({
      useClass: CacheModuleOptsFactory,
      imports: [ConfigModule],
    }),
  ],
  providers: [PrismaService, CacheService],
  exports: [HttpModule, PrismaService, CacheService],
})
export class CommonModule {}
