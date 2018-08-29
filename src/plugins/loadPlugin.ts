import { resolvePlugin } from "./resolvePlugin";
import { TDeps } from "../deps";
import { TContext, TsGeneratorPlugin } from "./types";
import { Dictionary } from "../stl";

export function loadPlugin(deps: TDeps, ctx: TContext): TsGeneratorPlugin {
  const pluginPath = resolvePlugin(deps, ctx.rawConfig.generator, ctx.cwd);
  const PluginModule = require(pluginPath);

  const moduleExportsCount = Object.keys(PluginModule).length;
  if (moduleExportsCount !== 1) {
    throw new Error(
      `Loading plugin ${
        ctx.rawConfig.generator
      } failed. Plugin module has to export exactly one entity. Found ${moduleExportsCount} instead`,
    );
  }

  const PluginCtr = getFirstKey<{ new (ctx: TContext): TsGeneratorPlugin }>(PluginModule);

  return new PluginCtr(ctx);
}

export function getFirstKey<T>(object: Dictionary<T>): T {
  for (const k of Object.keys(object)) {
    return object[k];
  }
  throw new Error("Any key missing!");
}
