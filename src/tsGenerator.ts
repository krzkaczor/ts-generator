import * as glob from "glob";

import { TFileDesc, TOutput, TsGeneratorPlugin } from "./plugins/types";
import { TCfg } from "./parseConfigFile";
import { TDeps, createDeps } from "./deps";
import { isArray } from "util";
import { dirname, relative } from "path";
import { outputTransformers } from "./outputTransformers";

export async function tsGenerator(
  cfg: TCfg,
  plugins_: TsGeneratorPlugin | TsGeneratorPlugin[],
  deps_?: TDeps,
): Promise<void> {
  const deps = deps_ || createDeps();
  const plugins = isArray(plugins_) ? plugins_ : [plugins_];

  const { cwd } = cfg;
  const { fs, logger } = deps;

  for (const plugin of plugins) {
    logger.verbose("Running before hook for", logger.accent(plugin.name));
    processOutput(deps, cfg, await plugin.beforeRun());

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

      processOutput(deps, cfg, await plugin.transformFile(fd));
    }

    logger.verbose("Running after hook for", logger.accent(plugin.name));
    processOutput(deps, cfg, await plugin.afterRun());
  }
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

    logger.verbose("Writing file: ", fd.path);
    fs.writeFileSync(fd.path, finalOutput, "utf8");
  });
}
