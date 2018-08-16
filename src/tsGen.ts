import * as glob from "glob";

import { TPluginConstructor, TFileDesc } from "./plugins/types";
import { resolvePlugin } from "./plugins/resolvePlugin";
import { parseConfigFile } from "./parseConfigFile";
import { TDeps } from "./deps";

interface TOptions {
  cwd: string;
  configPath: string;
}

export function tsGen(deps: TDeps, { configPath, cwd }: TOptions): void {
  const config = parseConfigFile(deps, configPath);

  for (const c of config) {
    const pluginPath = resolvePlugin(deps, c.generator, cwd);
    const PluginCtr = require(pluginPath).default as TPluginConstructor;
    const plugin = new PluginCtr({ cwd, config: c });

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
