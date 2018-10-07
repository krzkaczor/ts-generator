import { Options as PrettierOptions } from "prettier";

import { TDeps } from "./deps";
import { Dictionary, Omit } from "ts-essentials";
import { TLoggerLvl } from "./logger";

export type TRawPluginCfg<T = Dictionary<any>> = {
  files: string;
  generator: string;
} & T;

export type TPluginCfg<T = Dictionary<any>> = Omit<TRawPluginCfg<T>, "generator">;

export interface TRawCfg {
  cwd: string;
  plugins: TRawPluginCfg[];
  prettier?: PrettierOptions;
  loggingLvl?: TLoggerLvl;
}

export type TCfg = Omit<TRawCfg, "plugins">;

interface TArgs {
  cwd: string;
  configPath: string;
}

export async function parseConfigFile({ fs, prettier, logger }: TDeps, { cwd, configPath }: TArgs): Promise<TRawCfg> {
  const config = fs.readFileSync(configPath, "utf-8");

  // assume that config is correctly formatted JUST FOR NOW

  const pluginCfg = JSON.parse(config);
  const prettierCfg = await prettier.resolveConfig(cwd);

  if (prettierCfg) {
    logger.info("Using custom prettier config.");
  } else {
    logger.info("Using default prettier config.");
  }

  return {
    cwd,
    loggingLvl: "info",
    prettier: prettierCfg!,
    plugins: pluginCfg,
  };
}
