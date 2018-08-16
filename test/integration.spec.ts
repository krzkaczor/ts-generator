import * as fs from "fs";
import { join } from "path";
const snapshot = require("snap-shot-it"); // @FIXME(KK)  suddenly .d.ts files are being ignored

import { cli } from "../src/cli/cli";

describe("integration", () => {
  const generateFilePath = join(__dirname, "./integration/sample.json.d.ts");
  beforeEach(() => {
    try {
      fs.unlinkSync(generateFilePath);
    } catch {}
  });

  it("should run ts-gen programmatically", async () => {
    await cli("./test/integration/ts-gen.json");

    snapshot(fs.readFileSync(generateFilePath, "utf-8"));
  });
});
