import { join } from "path";
import { TDeps } from "../deps";

export function resolvePlugin({ fs, resolve }: TDeps, pluginName: string, cwd: string): string {
  const localPluginPath = join(cwd, "ts-gen-plugins", pluginName);
  const doesLocalPluginExist = fs.existsSync(localPluginPath);

  if (doesLocalPluginExist) {
    return localPluginPath;
  }

  return resolve(pluginName, { basedir: cwd });
}
