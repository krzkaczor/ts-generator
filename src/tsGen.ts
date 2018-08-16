import * as glob from "glob";

import { TFileDesc } from "./plugins/types";
import { parseConfigFile } from "./parseConfigFile";
import { TDeps } from "./deps";
import { loadPlugin } from "./plugins/loadPlugin";
import { TContext } from "./plugins/types";

export interface TArgs {
  cwd: string;
  configPath: string;
}

export async function tsGen(deps: TDeps, args: TArgs): Promise<void> {
  const { cwd } = args;

  const config = await parseConfigFile(deps, args);

  for (const c of config.plugins) {
    const ctx: TContext = { cwd, config: c };

    const plugin = loadPlugin(deps, ctx);

    plugin.init();

    const filePaths = glob.sync(c.files, { ignore: "node_modules/**", absolute: true, cwd });
    const fileDescs = filePaths.map(
      path =>
        ({
          path,
          contents: deps.fs.readFileSync(path, "utf8"),
        } as TFileDesc),
    );

    for (const fd of fileDescs) {
      const outputFds = plugin.transformFile(fd);
      outputFds.forEach(fd =>
        deps.fs.writeFileSync(fd.path, deps.prettier.format(fd.contents, config.prettier), "utf8"),
      );
    }
  }
}
