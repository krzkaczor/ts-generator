import { join, dirname } from "path";
import { tsGen } from "../tsGen";
import { createDeps, TDeps } from "../deps";

export async function cli(configPathRel: string, customDeps?: Partial<TDeps>): Promise<void> {
  const configPath = join(process.cwd(), configPathRel);
  const cwd = dirname(configPath);

  const deps = { ...createDeps(), ...customDeps };

  await tsGen(deps, { configPath, cwd });
}
