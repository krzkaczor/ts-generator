import { resolvePlugin } from "./resolvePlugin";
import { TDeps } from "../deps";
import { TContext, TsGeneratorPlugin } from "./types";

export function loadPlugin(deps: TDeps, ctx: TContext): TsGeneratorPlugin {
  const pluginPath = resolvePlugin(deps, ctx.rawConfig.generator, ctx.cwd);
  const PluginCtr = require(pluginPath).default as { new (ctx: TContext): TsGeneratorPlugin };

  return new PluginCtr(ctx);
}
