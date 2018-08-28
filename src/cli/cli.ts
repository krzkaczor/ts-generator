import { join, dirname } from "path";
import { tsGen } from "../tsGen";
import { createDeps, TDeps } from "../deps";
import { parseConfigFile } from "../parseConfigFile";
import { loadPlugin } from "../plugins/loadPlugin";

export async function cli(configPathRel: string, customDeps?: Partial<TDeps>): Promise<void> {
  const configPath = join(process.cwd(), configPathRel);
  const cwd = dirname(configPath);

  const deps = { ...createDeps(), ...customDeps };

  const cfg = await parseConfigFile(deps, { configPath, cwd });

  const plugins = cfg.plugins.map(pluginCfg => loadPlugin(deps, { cwd: cfg.cwd, rawConfig: pluginCfg }));

  await tsGen(cfg, plugins, deps);
}
