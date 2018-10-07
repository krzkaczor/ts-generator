import * as glob from "glob";

import { TFileDesc, TOutput, TsGeneratorPlugin } from "./plugins/types";
import { TCfg } from "./parseConfigFile";
import { TDeps, createDeps } from "./deps";
import { isArray } from "util";
import { dirname, relative } from "path";
import { outputTransformers } from "./outputTransformers";

const stats = {
  filesGenerated: 0,
};

export async function tsGenerator(
  cfg: TCfg,
  plugins_: TsGeneratorPlugin | TsGeneratorPlugin[],
  deps_?: TDeps,
): Promise<void> {
  const deps = deps_ || createDeps();
  const plugins = isArray(plugins_) ? plugins_ : [plugins_];

  const { cwd } = cfg;
  const { fs, logger } = deps;
  logger.lvl = cfg.loggingLvl || "error";

  for (const plugin of plugins) {
    logger.info(`Running ${plugin.name}`);
    logger.verbose("Running before hook for", logger.accent(plugin.name));
    processOutput(deps, cfg, await plugin.beforeRun());

    const filePaths = glob.sync(plugin.ctx.rawConfig.files, { ignore: "node_modules/**", absolute: true, cwd });
    logger.info(`${plugin.ctx.rawConfig.files} matched ${filePaths.length} files.`);

    const fileDescs = filePaths.map(
      path =>
        ({
          path,
          contents: fs.readFileSync(path, "utf8"),
        } as TFileDesc),
    );

    for (const fd of fileDescs) {
      logger.info(`Processing ${logger.accent(relative(cwd, fd.path))}`);

      processOutput(deps, cfg, await plugin.transformFile(fd));
    }

    logger.verbose("Running after hook for", logger.accent(plugin.name));
    processOutput(deps, cfg, await plugin.afterRun());
  }

  logger.info(`💎 All done! Generated files: ${stats.filesGenerated}`);
}

export function processOutput(deps: TDeps, cfg: TCfg, output: TOutput): void {
  const { fs, logger, mkdirp } = deps;
  if (!output) {
    return;
  }
  const outputFds = isArray(output) ? output : [output];

  outputFds.forEach(fd => {
    // ensure directory first
    mkdirp(dirname(fd.path));

    const finalOutput = outputTransformers.reduce(
      (content, transformer) => transformer(content, deps, cfg),
      fd.contents,
    );

    logger.info(`Writing file: ${logger.accent(relative(cfg.cwd, fd.path))}`);
    stats.filesGenerated++;
    fs.writeFileSync(fd.path, finalOutput, "utf8");
  });
}
