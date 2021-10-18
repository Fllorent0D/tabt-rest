import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthCheckResult, HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';
import { TestRequestService } from '../../../services/test/test-request.service';
import { ContextService } from '../../../common/context/context.service';

describe('HealthController', () => {
  let controller: HealthController;
  let healthCheckService: HealthCheckService;
  let httpHealthIndicator: HttpHealthIndicator;
  let testService: TestRequestService;

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
          provide: HttpHealthIndicator,
          useValue: {
            pingCheck: jest.fn(),
          },
        },
        {
          provide: TestRequestService,
          useValue: {
            testRequest: jest.fn(),
          }
        },
        {
          provide: ContextService,
          useValue: {
            context: {},
          }
        }
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    healthCheckService = module.get<HealthCheckService>(HealthCheckService);
    httpHealthIndicator = module.get<HttpHealthIndicator>(HttpHealthIndicator);
    testService = module.get<TestRequestService>(TestRequestService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should ping both wsdl', () => {
    const dnsSpy = jest.spyOn(httpHealthIndicator, 'pingCheck');

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

  it('should test the request', () => {
    const spy = jest.spyOn(testService, 'testRequest');

    controller.test();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
