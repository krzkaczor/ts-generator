#!/usr/bin/env node
import { cli } from "./cli";

const configPathRel = process.argv[2];
// tslint:disable-next-line
console.assert(configPathRel, "You need to provide config path!");

cli(configPathRel).catch(e => {
  // tslint:disable-next-line
  console.log("💣 Error occured!");
  // tslint:disable-next-line
  console.error(e);
  process.exit(1);
});
