import * as fs from "fs";
import { join, dirname, relative } from "path";
import * as glob from "glob";

import { TDeps, TPluginConstructor, TFileDesc } from "./types";
import { parseConfigFile } from "./parseConfigFile";
import { resolvePlugin } from "./resolvePlugin";

export function getFilenameWithoutAnyExtensions(filePath: string): string {
  const endPosition = filePath.indexOf(".");
  return filePath.slice(0, endPosition !== -1 ? endPosition : filePath.length);
}

export function getRelativeModulePath(from: string, to: string): string {
  return ("./" + relative(from, to)).replace(".ts", ""); // @note: this is probably not the best way to find relative path for modules
}

function main(): void {
  const deps: TDeps = {
    fs,
    resolve: require.resolve.bind(require),
  };

  const configPath = join(__dirname, "../example/ts-gen.json");
  const cwd = dirname(configPath);

  const config = parseConfigFile(deps, configPath);

  for (const c of config) {
    const pluginPath = resolvePlugin(deps, c.generator, cwd);
    const PluginCtr = require(pluginPath).default as TPluginConstructor;
    const plugin = new PluginCtr({ cwd }, c.options);

    plugin.init();

    const filePaths = glob.sync(c.files, { ignore: "node_modules/**", absolute: true, cwd });
    const fileDescs = filePaths.map(
      path =>
        ({
          path,
          contents: fs.readFileSync(path, "utf8"),
        } as TFileDesc),
    );

    for (const fd of fileDescs) {
      const outputFds = plugin.transformFile(fd);
      outputFds.forEach(fd => fs.writeFileSync(fd.path, fd.contents, "utf8"));
    }
  }
}

main();
