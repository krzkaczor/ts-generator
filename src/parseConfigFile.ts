import { TDeps } from "./deps";
import { Options as PrettierOptions } from "prettier";
import { Dictionary } from "./stl";

export type TPluginCfg<T = Dictionary<any>> = {
  files: string;
  generator: string;
} & T;

export interface TTsGenCfg {
  cwd: string;
  plugins: TPluginCfg[];
  prettier?: PrettierOptions;
}

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
