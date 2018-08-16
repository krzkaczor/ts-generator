import { join, dirname } from "path";
import { tsGen } from "../tsGen";
import { createDeps } from "../deps";

function main(): void {
  const configPathRel = process.argv[2];
  // tslint:disable-next-line
  console.assert(configPathRel, "You need to provide config path!");

  const configPath = join(process.cwd(), configPathRel);
  const cwd = dirname(configPath);

  const deps = createDeps();

  tsGen(deps, { configPath, cwd });
}

main();
