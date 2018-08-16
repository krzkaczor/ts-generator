import { TDeps } from "./deps";
import { Options as PrettierOptions } from "prettier";
import { TArgs } from "./tsGen";

export interface TPluginCfg {
  files: string;
  generator: string;
  [key: string]: any;
}

export interface TTsGenCfg {
  prettier: PrettierOptions;
  plugins: TPluginCfg[];
}

export async function parseConfigFile({ fs, prettier }: TDeps, { cwd, configPath }: TArgs): Promise<TTsGenCfg> {
  const config = fs.readFileSync(configPath, "utf-8");

  // assume that config is correctly formatted JUST FOR NOW

  const pluginCfg = JSON.parse(config);
  const prettierCfg = await prettier.resolveConfig(cwd);

  return {
    prettier: { ...(prettierCfg || {}), parser: "typescript" },
    plugins: pluginCfg,
  };
}
