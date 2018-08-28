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
    } catch {}
  });

  it("should run ts-gen programmatically", async () => {
    await cli("./test/integration/ts-gen.json", { logger: new NoLogger() });

    snapshot(fs.readFileSync(generateFilePath, "utf-8"));
    snapshot(fs.readFileSync(afterFilePath, "utf-8"));
    snapshot(fs.readFileSync(beforeFilePath, "utf-8"));
  });
});
