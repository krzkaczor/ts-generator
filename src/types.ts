import * as fs from "fs";

export interface TDeps {
  fs: typeof fs;
  resolve: (module: string) => string;
}

export interface TPluginCfg {
  files: string;
  generator: string;
  [key: string]: any;
}

export interface TContext {
  cwd: string;
  config: TPluginCfg;
}

export interface TFileDesc {
  path: string;
  contents: string;
}

export interface TPluginConstructor {
  new (ctx: TContext): TPlugin;
}

export interface TPlugin {
  init: () => void;
  transformFile: (file: TFileDesc) => TFileDesc[];
}
