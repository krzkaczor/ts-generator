import { TPluginCfg } from "../parseConfigFile";
import { Dictionary } from "../stl";

export type TPluginState = "uninitialized" | "initialized";

export abstract class TsGeneratorPlugin {
  public state: TPluginState = "uninitialized";

  constructor(protected ctx: TContext) {}

  abstract init(): void | Promise<void>;

  abstract transformFile(file: TFileDesc): TFileDesc | TFileDesc[] | Promise<TFileDesc | TFileDesc[]>;
}

export interface TContext<T = Dictionary<any>> {
  cwd: string;
  config: TPluginCfg<T>;
}

export interface TFileDesc {
  path: string;
  contents: string;
}
