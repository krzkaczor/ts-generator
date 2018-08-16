import { TPluginCfg } from "../parseConfigFile";

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
