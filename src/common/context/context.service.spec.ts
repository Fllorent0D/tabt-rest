import { Test } from '@nestjs/testing';
import { DatabaseContextService, DEFAULT_LANG, TABT_LANGUAGE } from './database-context.service';
import { ContextService } from './context.service';
import { PackageService } from '../package/package.service';
import { Req } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

describe('ContextService', () => {
  describe('context', () => {
    it('should create a context based on the request', () => {
      //service.registerHttpHeaders(['test', 'test2']);
      const request = {
        id: '123',
        headers: {
          'x-tabt-account': 'test',
          'x-tabt-password': 'test2',
          'x-tabt-database': 'test4',
          'not-registered-header': 'should not be in context'
        },
      };
      const packageInfo = {
        name: 'TabtRest',
        version: '1.0.0',
      };

      const ser = new ContextService(request, packageInfo as PackageService);

      expect(ser.context.caller).toEqual({
          'X-Tabt-Account': 'test',
          'X-Tabt-Database': 'test4',
          'X-Tabt-Password': 'test2',
          'correlationId': '123',
        },
      );
      expect(ser.context.runner.name).toEqual('TabtRest');
      expect(ser.context.runner.version).toEqual('1.0.0');
    });
  });
});
