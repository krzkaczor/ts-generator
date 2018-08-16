import * as glob from "glob";

import { TFileDesc } from "./plugins/types";
import { parseConfigFile } from "./parseConfigFile";
import { TDeps } from "./deps";
import { loadPlugin } from "./plugins/loadPlugin";
import { TContext } from "../dist/publicApi";

interface TOptions {
  cwd: string;
  configPath: string;
}

export function tsGen(deps: TDeps, { configPath, cwd }: TOptions): void {
  const config = parseConfigFile(deps, configPath);

  for (const c of config) {
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
      outputFds.forEach(fd => deps.fs.writeFileSync(fd.path, fd.contents, "utf8"));
    }
  }
}
