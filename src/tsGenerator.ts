import * as glob from "glob";
import { Options as PrettierOptions } from "prettier";

import { TFileDesc, TOutput, TsGeneratorPlugin } from "./plugins/types";
import { TTsGenCfg } from "./parseConfigFile";
import { TDeps, createDeps } from "./deps";
import { isArray } from "util";
import { Omit } from "./stl";
import { dirname, relative } from "path";

export async function tsGenerator(
  cfg: Omit<TTsGenCfg, "plugins">,
  _plugins: TsGeneratorPlugin | TsGeneratorPlugin[],
  _deps?: TDeps,
): Promise<void> {
  const deps = _deps || createDeps();
  const plugins = isArray(_plugins) ? _plugins : [_plugins];

  const { cwd, prettier } = cfg;
  const { fs, logger } = deps;

  for (const plugin of plugins) {
    logger.verbose("Running before hook for", logger.accent(plugin.name));
    processOutput(deps, prettier, await plugin.beforeRun());

    const filePaths = glob.sync(plugin.ctx.rawConfig.files, { ignore: "node_modules/**", absolute: true, cwd });
    const fileDescs = filePaths.map(
      path =>
        ({
          path,
          contents: fs.readFileSync(path, "utf8"),
        } as TFileDesc),
    );
    for (const fd of fileDescs) {
      logger.info(`Processing ${logger.accent(relative(cwd, fd.path))} with ${logger.accent(plugin.name)} plugin`);

      processOutput(deps, prettier, await plugin.transformFile(fd));
    }

    logger.verbose("Running after hook for", logger.accent(plugin.name));
    processOutput(deps, prettier, await plugin.afterRun());
  }
}

export function processOutput(
  { fs, prettier, logger, mkdirp }: TDeps,
  prettierCfg: PrettierOptions | undefined,
  output: TOutput,
): void {
  if (!output) {
    return;
  }
  const outputFds = isArray(output) ? output : [output];

  outputFds.forEach(fd => {
    // ensure directory first
    mkdirp(dirname(fd.path));

    logger.verbose("Writing file: ", fd.path);
    fs.writeFileSync(fd.path, prettier.format(fd.contents, { ...(prettierCfg || {}), parser: "typescript" }), "utf8");
  });
}
