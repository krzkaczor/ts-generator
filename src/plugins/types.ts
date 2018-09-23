import { TPluginCfg } from "../parseConfigFile";
import { Dictionary } from "ts-essentials";
import { TLogger, NoLogger } from "../logger";

export type TOutput = void | TFileDesc | TFileDesc[];

export abstract class TsGeneratorPlugin {
  public abstract readonly name: string;
  public readonly logger: TLogger;

  constructor(public readonly ctx: TContext) {
    this.logger = ctx.logger || new NoLogger();
  }

  beforeRun(): TOutput | Promise<TOutput> {}
  afterRun(): TOutput | Promise<TOutput> {}

  abstract transformFile(file: TFileDesc): TOutput | Promise<TOutput>;
}

export interface TContext<T = Dictionary<any>> {
  cwd: string;
  rawConfig: TPluginCfg<T>;
  logger?: TLogger;
}

export interface TFileDesc {
  path: string;
  contents: string;
}
