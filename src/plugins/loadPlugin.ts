import { resolvePlugin } from "./resolvePlugin";
import { TDeps } from "../deps";
import { TContext, TPluginConstructor } from "./types";
import { TPlugin } from "./types";

export function loadPlugin(deps: TDeps, ctx: TContext): TPlugin {
  const pluginPath = resolvePlugin(deps, ctx.config.generator, ctx.cwd);
  const PluginCtr = require(pluginPath).default as TPluginConstructor;

  return new PluginCtr(ctx);
}
