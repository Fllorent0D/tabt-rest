import { stringify } from 'flatted';
import { isString } from 'lodash';

export abstract class JsonUtil {
  static stringify(arg: any, replacer: any = null, space = 0): string {
    if (isString(arg)) {
      return arg;
    }
    if (arg instanceof Map) {
      // Map can't be stringified so we create an array with the entries of the map
      return JsonUtil.stringifyMap(arg, replacer, space);
    }
    if (arg instanceof Set) {
      // Set can't be stringified so we create an array with the entries of the set
      return JsonUtil.stringifyObject([...arg], replacer, space);
    }
    return JsonUtil.stringifyObject(arg, replacer, space);
  }

  static stringifyObject(obj: any, replacer: any = null, space = 0): string {
    return stringify(obj, replacer, space);
  }

  static stringifyMap(map: Map<any, any>, replacer: any = null, space = 0): string {
    const selfIterator = (m: any): any =>
      Array.from(m).reduce((acc: any, [key, value]: any) => {
        if (value instanceof Map) {
          acc[key] = selfIterator(value);
        } else {
          acc[key] = value;
        }

        return acc;
      }, {});
    const res = selfIterator(map);
    return this.stringifyObject(res, replacer, space);
  }

  static safeJSONParse(data: string): any {
    try {
      return JSON.parse(data);
    } catch (e) {
      return undefined;
    }
  }
}
