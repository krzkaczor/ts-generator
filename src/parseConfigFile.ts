import { Options as PrettierOptions } from "prettier";

import { TDeps } from "./deps";
import { Dictionary } from "./stl";
import { Omit } from "./stl";

export type TPluginCfg<T = Dictionary<any>> = {
  files: string;
  generator: string;
} & T;

export interface TTsGenCfg {
  cwd: string;
  plugins: TPluginCfg[];
  prettier?: PrettierOptions;
}

export type TCfg = Omit<TTsGenCfg, "plugins">;

interface TArgs {
  cwd: string;
  configPath: string;
}

export async function parseConfigFile({ fs, prettier, logger }: TDeps, { cwd, configPath }: TArgs): Promise<TTsGenCfg> {
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
    prettier: prettierCfg!,
    plugins: pluginCfg,
  };
}
