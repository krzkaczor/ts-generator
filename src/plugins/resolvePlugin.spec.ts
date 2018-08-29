import { spy } from "sinon";
import { expect } from "chai";

import { resolvePlugin } from "../../src/plugins/resolvePlugin";
import { TDeps } from "../../src/deps";

describe("resolvePlugin", () => {
  it("should try resolve in local directory first", () => {
    const deps: TDeps = {
      fs: {
        existsSync: spy(() => true),
      },
    } as any;

    const pluginPath = resolvePlugin(deps, "sample-plugin", "/app");

    expect(pluginPath).to.be.eq("/app/ts-gen-plugins/sample-plugin");
  });
});
