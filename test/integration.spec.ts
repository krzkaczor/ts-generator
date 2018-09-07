import * as fs from "fs";
import { join } from "path";
const snapshot = require("snap-shot-it"); // @FIXME(KK)  suddenly .d.ts files are being ignored

import { cli } from "../src/cli/cli";
import { NoLogger } from "../src/logger";

describe("integration", () => {
  const generateFilePath = join(__dirname, "./integration/sample.json.d.ts");
  const afterFilePath = join(__dirname, "./integration/after.ts");
  const beforeFilePath = join(__dirname, "./integration/before.ts");

  beforeEach(() => {
    try {
      fs.unlinkSync(generateFilePath);
      fs.unlinkSync(afterFilePath);
      fs.unlinkSync(beforeFilePath);
    } catch {}
  });

  it("should run ts-gen programmatically", async () => {
    const fsButWithFixedNpmVersion: typeof fs = {
      ...fs,
      readFileSync: (...args: any[]): any => {
        const packageJsonPath = join(__dirname, "../package.json");
        if (args[0] === packageJsonPath) {
          return JSON.stringify({
            version: "1.0.0",
          });
        } else {
          return (fs as any).readFileSync(...args);
        }
      },
    };

    await cli("./test/integration/ts-gen.json", { logger: new NoLogger(), fs: fsButWithFixedNpmVersion });

    snapshot(fs.readFileSync(generateFilePath, "utf-8"));
    snapshot(fs.readFileSync(afterFilePath, "utf-8"));
    snapshot(fs.readFileSync(beforeFilePath, "utf-8"));
  });
});
