import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { DNSHealthIndicator, HealthCheckResult, HealthCheckService } from '@nestjs/terminus';
import exp from 'constants';

describe('HealthController', () => {
  let controller: HealthController;
  let healthCheckService: HealthCheckService;
  let dnsService: DNSHealthIndicator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: {
            check: jest.fn(),
          },
        },
        {
          provide: DNSHealthIndicator,
          useValue: {
            pingCheck: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    healthCheckService = module.get<HealthCheckService>(HealthCheckService);
    dnsService = module.get<DNSHealthIndicator>(DNSHealthIndicator);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should ping both wsdl', () => {
    const dnsSpy = jest.spyOn(dnsService, 'pingCheck');

    const checkSpy = jest.spyOn(healthCheckService, 'check').mockImplementation((fns) => {
      fns.map((fn) => fn());
      return {} as Promise<HealthCheckResult>;
    });

    controller.check();
    expect(dnsSpy).toHaveBeenCalledTimes(2);
    expect(dnsSpy).toHaveBeenNthCalledWith(1, 'AFTT API', 'https://resultats.aftt.be/api/?wsdl');
    expect(dnsSpy).toHaveBeenNthCalledWith(2, 'VTTL API', 'https://api.vttl.be/?wsdl');
    expect(checkSpy).toHaveBeenCalledTimes(1);
  });
});
