import { TPluginCfg } from "../parseConfigFile";
import { Dictionary } from "../stl";

export type TPluginState = "uninitialized" | "initialized";

export type TOutput = void | TFileDesc | TFileDesc[];

export abstract class TsGeneratorPlugin {
  public state: TPluginState = "uninitialized";
  public abstract readonly name: string;

  constructor(public readonly ctx: TContext) {}

  beforeRun(): TOutput | Promise<TOutput> {}
  afterRun(): TOutput | Promise<TOutput> {}

  abstract transformFile(file: TFileDesc): TOutput | Promise<TOutput>;
}

export interface TContext<T = Dictionary<any>> {
  cwd: string;
  rawConfig: TPluginCfg<T>;
}

export interface TFileDesc {
  path: string;
  contents: string;
}
