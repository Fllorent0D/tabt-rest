import { HttpUtil } from './http.util';

describe('HttpUtil', () => {
  describe('isUrl', () => {
    it('should return true if it s a url', () => {
      expect(HttpUtil.isUrl('http://florentcardoen.be')).toBeTruthy();
    });
    it('should return false if it s not a url', () => {
      expect(HttpUtil.isUrl('dsqfdqsfqsdf')).toBeFalsy();
    });
  });
});
