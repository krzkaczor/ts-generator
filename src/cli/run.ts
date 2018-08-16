import { cli } from "./cli";

const configPathRel = process.argv[2];
// tslint:disable-next-line
console.assert(configPathRel, "You need to provide config path!");

cli(configPathRel).catch(e => {
  process.exit(1);
  // tslint:disable-next-line
  console.error(e);
});
