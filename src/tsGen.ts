import * as glob from "glob";

import { TFileDesc } from "./plugins/types";
import { parseConfigFile } from "./parseConfigFile";
import { TDeps } from "./deps";
import { loadPlugin } from "./plugins/loadPlugin";
import { TContext } from "./plugins/types";
import { isArray } from "util";

export interface TArgs {
  cwd: string;
  configPath: string;
}

export async function tsGen(deps: TDeps, args: TArgs): Promise<void> {
  const { cwd } = args;
  const { fs, logger, prettier } = deps;

  const genConfig = await parseConfigFile(deps, args);

  for (const config of genConfig.plugins) {
    const ctx: TContext = { cwd, config };

    const plugin = loadPlugin(deps, ctx);

    await plugin.init();

    const filePaths = glob.sync(config.files, { ignore: "node_modules/**", absolute: true, cwd });
    const fileDescs = filePaths.map(
      path =>
        ({
          path,
          contents: fs.readFileSync(path, "utf8"),
        } as TFileDesc),
    );

    for (const fd of fileDescs) {
      logger.info(`Processing ${fd.path} with ${config.generator} plugin`);

      const output = await plugin.transformFile(fd);
      const outputFds = isArray(output) ? output : [output];

      outputFds.forEach(fd => fs.writeFileSync(fd.path, prettier.format(fd.contents, genConfig.prettier), "utf8"));
    }
  }
}
