import { TDeps } from "./types";
import { join } from "path";

export function resolvePlugin({ resolve, fs }: TDeps, pluginName: string, cwd: string): string {
  const localPluginPath = join(cwd, "ts-gen-plugins", pluginName, "index.ts"); // @todo this should be probably .js
  const doesLocalPluginExist = fs.existsSync(localPluginPath);

  if (doesLocalPluginExist) {
    return localPluginPath;
  }

  return resolve(localPluginPath); // does it return file path or just directory path?
}
