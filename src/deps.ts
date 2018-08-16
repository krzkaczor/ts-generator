import * as fs from "fs";

export interface TDeps {
  fs: typeof fs;
  resolve: (module: string) => string;
}

export function createDeps(): TDeps {
  return {
    fs,
    resolve: require.resolve.bind(require),
  };
}
