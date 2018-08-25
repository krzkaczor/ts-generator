import { resolvePlugin } from "./resolvePlugin";
import { TDeps } from "../deps";
import { TContext, TsGeneratorPlugin } from "./types";

export function loadPlugin(deps: TDeps, ctx: TContext): TsGeneratorPlugin {
  const pluginPath = resolvePlugin(deps, ctx.config.generator, ctx.cwd);
  const PluginCtr = require(pluginPath).default as { new (ctx: TContext): TsGeneratorPlugin };

  return new PluginCtr(ctx);
}
