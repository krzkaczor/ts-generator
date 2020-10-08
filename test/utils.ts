import { spy } from "sinon";
import { isFunction, isObject } from "util";
import { DeepPartial } from "ts-essentials";

export function spyify<T extends any>(mock: T | undefined): T | undefined {
  if (!mock) {
    return;
  }

  if (!isObject(mock)) {
    return mock;
  }

  Object.keys(mock).forEach((key) => {
    if (!isFunction(mock[key])) {
      mock[key] = spyify(mock[key]);
    } else {
      mock[key] = spy(mock[key]);
    }
  });

  return mock;
}

const IS_MOCK = Symbol.for("IS_MOCK");

export function unimock<T>(mock: DeepPartial<T>): T {
  const mockWithSpies = spyify(mock as any);

  return new Proxy(mockWithSpies, {
    get(target: any, key: PropertyKey): any {
      if (key === IS_MOCK) {
        return true;
      }

      if (!(key in target)) {
        throw new Error(`Property ${key.toString()} was accessed despite being not mocked!`);
      }

      const v = target[key];
      if (isObject(v) && !v[IS_MOCK]) {
        target[key] = unimock(v);
        return target[key];
      } else {
        return v;
      }
    },
  });
}
