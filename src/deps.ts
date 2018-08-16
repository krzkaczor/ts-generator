import * as fs from "fs";
import * as prettier from "prettier";

export interface TDeps {
  fs: typeof fs;
  prettier: typeof prettier;
  resolve: (module: string) => string;
}

export function createDeps(): TDeps {
  return {
    fs,
    prettier,
    resolve: require.resolve.bind(require),
  };
}
