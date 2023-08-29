import { PackageService } from './package.service';

describe('TabtFilter', () => {
  let service: PackageService;
  const name = 'Yo it\'s flo';
  const version = '1.0.0';
  beforeEach(() => {
    jest.mock('../../../package.json', () => ({
      version, name,
    }), { virtual: true });

    service = new PackageService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return the name in the package.json', () => {
    expect(service.name).toEqual(name);
  });
  it('should return the version in the package.json', () => {
    expect(service.version).toEqual(version);
  });
});
