import { join, dirname } from "path";
import { tsGen } from "../tsGen";
import { createDeps } from "../deps";

export function cli(configPathRel: string): void {
  const configPath = join(process.cwd(), configPathRel);
  const cwd = dirname(configPath);

  const deps = createDeps();

  tsGen(deps, { configPath, cwd });
}
