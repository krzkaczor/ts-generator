#!/usr/bin/env node
import { join, dirname } from "path";
import { tsGenerator } from "../tsGenerator";
import { createDeps, TDeps } from "../deps";
import { parseConfigFile } from "../parseConfigFile";
import { loadPlugin } from "../plugins/loadPlugin";

export async function cli(configPathRel: string, customDeps?: Partial<TDeps>): Promise<void> {
  const configPath = join(process.cwd(), configPathRel);
  const cwd = dirname(configPath);

  const deps = { ...createDeps(), ...customDeps };

  const cfg = await parseConfigFile(deps, { configPath, cwd });

  const plugins = cfg.plugins.map(pluginCfg =>
    loadPlugin(deps, { cwd: cfg.cwd, rawConfig: pluginCfg, logger: deps.logger.childLogger(pluginCfg.generator) }),
  );

  await tsGenerator(cfg, plugins, deps);
}
