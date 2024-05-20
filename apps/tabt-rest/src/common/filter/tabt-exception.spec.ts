import { TabtException } from './tabt-exception';

describe('TabtException', () => {

  it('tabt responds with error code 8', () => {
    const exception = new TabtException('8', 'test');

    expect(exception.message).toEqual('test');
    expect(exception.getStatus()).toEqual(500);
  });
  it('tabt responds with error code 5', () => {
    const exception = new TabtException('5', 'test');

    expect(exception.message).toEqual('test');
    expect(exception.getStatus()).toEqual(500);
  });
  it('tabt responds with error code 27', () => {
    const exception = new TabtException('27', 'test');

    expect(exception.message).toEqual('test');
    expect(exception.getStatus()).toEqual(403);
  });
  it('tabt responds with error code 47', () => {
    const exception = new TabtException('47', 'test');

    expect(exception.message).toEqual('test');
    expect(exception.getStatus()).toEqual(403);
  });
  it('tabt responds with error code 123', () => {
    const exception = new TabtException('123', 'test');

    expect(exception.message).toEqual('test');
    expect(exception.getStatus()).toEqual(400);
  });
});
