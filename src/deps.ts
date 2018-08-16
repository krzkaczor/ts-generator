import * as fs from "fs";
import * as prettier from "prettier";
import { TLogger, ConsoleLogger } from "./logger";

export interface TDeps {
  fs: typeof fs;
  prettier: typeof prettier;
  resolve: (module: string) => string;
  logger: TLogger;
}

export function createDeps(): TDeps {
  return {
    fs,
    prettier,
    resolve: require.resolve.bind(require),
    logger: new ConsoleLogger(false),
  };
}
