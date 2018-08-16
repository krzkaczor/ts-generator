import { join, dirname } from "path";
import { tsGen } from "../tsGen";
import { createDeps } from "../deps";

export async function cli(configPathRel: string): Promise<void> {
  const configPath = join(process.cwd(), configPathRel);
  const cwd = dirname(configPath);

  const deps = createDeps();

  await tsGen(deps, { configPath, cwd });
}
