import * as fs from "fs";
import * as prettier from "prettier";
import { sync as mkdirp } from "mkdirp";
import { TLogger, ConsoleLogger } from "./logger";

export interface TDeps {
  fs: typeof fs;
  prettier: typeof prettier;
  resolve: (module: string) => string;
  logger: TLogger;
  mkdirp: typeof mkdirp;
}

export function createDeps(): TDeps {
  return {
    fs,
    prettier,
    mkdirp,
    resolve: require.resolve.bind(require),
    logger: new ConsoleLogger("ts-gen", "normal"),
  };
}
