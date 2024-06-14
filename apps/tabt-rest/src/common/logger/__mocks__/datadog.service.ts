export class DatadogService {
  public statsD = {
    increment: jest.fn(),
    event: jest.fn(),
  };
  public tracer = {
    init: jest.fn(),
  };
}
