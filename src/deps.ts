import * as fs from "fs";
import * as prettier from "prettier";
import { sync as mkdirp } from "mkdirp";
import * as resolve from "resolve";

import { TLogger, ConsoleLogger } from "./logger";

export interface TDeps {
  fs: typeof fs;
  prettier: typeof prettier;
  resolve: typeof resolve.sync;
  logger: TLogger;
  mkdirp: typeof mkdirp;
}

export function createDeps(): TDeps {
  return {
    fs,
    prettier,
    mkdirp,
    resolve: resolve.sync.bind(resolve),
    logger: new ConsoleLogger("ts-gen", "info"),
  };
}
