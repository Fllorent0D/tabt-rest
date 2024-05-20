import { ContextService } from './context.service';
import { PackageService } from '../package/package.service';
import { TABT_HEADERS } from './context.constants';
import { ConfigService } from '@nestjs/config';

describe('ContextService', () => {
  describe('context', () => {
    it('should create a context based on the request', () => {
      //service.registerHttpHeaders(['test', 'test2']);
      const request = {
        id: '123',
        connection:{
          remoteAddress: '55.55.55.55',
        },
        headers: {
          'x-tabt-account': 'test',
          'x-tabt-password': 'test2',
          'x-tabt-database': 'test4',
          'x-forwarded-for': '111.111.111.111',
          'not-registered-header': 'should not be in context',
        },
      };
      const packageInfo = {
        name: 'TabtRest',
        version: '1.0.0',
      };
      const configService = {
        get: jest.fn().mockReturnValue('23')
      }

      const ser = new ContextService(request, TABT_HEADERS, packageInfo as PackageService, configService as unknown as ConfigService);

      expect(ser.context.caller).toEqual({
          'X-Tabt-Account': 'test',
          'X-Tabt-Database': 'test4',
          'X-Tabt-Password': 'test2',
          'X-Forwarded-For': '111.111.111.111',
          'remoteAddress': '55.55.55.55',
          'correlationId': '123',
        },
      );
      expect(ser.context.runner.name).toEqual('TabtRest');
      expect(ser.context.runner.version).toEqual('1.0.0');
    });
    it('should replace the ipv6 loopback by 127.0.0.1', () => {
      //service.registerHttpHeaders(['test', 'test2']);
      const request = {
        id: '123',
        connection:{
          remoteAddress: '::1',
        },
        headers:{}
      };
      const packageInfo = {
        name: 'TabtRest',
        version: '1.0.0',
      };

      const configService = {
        get: jest.fn().mockReturnValue('23')
      }

      const ser = new ContextService(request, TABT_HEADERS, packageInfo as PackageService, configService as unknown as ConfigService);

      expect(ser.context.caller).toEqual({
          'remoteAddress': '127.0.0.1',
          'correlationId': '123',
        },
      );
    });
  });
});
