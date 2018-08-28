import { TFileDesc } from "../src/publicApi";
import { processOutput } from "../src/tsGenerator";
import { unimock } from "./utils";
import { TDeps } from "../src/deps";
import { expect } from "chai";
import { NoLogger } from "../src/logger";
import { TCfg } from "../src/parseConfigFile";
import { generateInfo } from "../src/outputTransformers/info";

describe("processOutput", () => {
  const logger = new NoLogger();
  const dummyCfg: TCfg = {
    cwd: "/",
  };

  it("should do nothing when no files to process", () => {
    const deps = unimock<TDeps>({
      fs: undefined,
      prettier: undefined,
      logger: undefined,
      mkdirp: undefined,
    });

    processOutput(deps, dummyCfg, undefined);
  });

  it("should work with single file", () => {
    const file: TFileDesc = { path: "/dir/a.ts", contents: "AAA" };

    const deps = unimock<TDeps>({
      fs: { writeFileSync: () => {}, readFileSync: () => "{}" },
      prettier: { format: (contents: string) => contents },
      logger,
      mkdirp: (_path: string) => {},
    });

    processOutput(deps, dummyCfg, file);

    expect(deps.mkdirp).to.be.calledOnce;
    expect(deps.mkdirp).to.be.calledWithExactly("/dir");

    expect(deps.prettier.format).to.be.calledOnce;
    expect(deps.prettier.format).to.be.calledWithExactly(wrapWithInfoBlock("AAA"), { parser: "typescript" });

    expect(deps.fs.writeFileSync).to.be.calledOnce;
    expect(deps.fs.writeFileSync).to.be.calledWithExactly("/dir/a.ts", wrapWithInfoBlock("AAA"), "utf8");
  });

  it("should work with multiple files", () => {
    const files: TFileDesc[] = [{ path: "/dir/a.ts", contents: "AAA" }, { path: "/dir/b.ts", contents: "BBB" }];

    const deps = unimock<TDeps>({
      fs: { writeFileSync: () => {}, readFileSync: () => "{}" },
      prettier: { format: (contents: string) => contents },
      logger,
      mkdirp: (_path: string) => {},
    });

    processOutput(deps, dummyCfg, files);

    expect(deps.mkdirp).to.be.calledTwice;
    expect(deps.mkdirp).to.be.calledWithExactly("/dir");

    expect(deps.prettier.format).to.be.calledTwice;
    expect(deps.prettier.format).to.be.calledWithExactly(wrapWithInfoBlock("AAA"), { parser: "typescript" });
    expect(deps.prettier.format).to.be.calledWithExactly(wrapWithInfoBlock("BBB"), { parser: "typescript" });

    expect(deps.fs.writeFileSync).to.be.calledTwice;
    expect(deps.fs.writeFileSync).to.be.calledWithExactly("/dir/a.ts", wrapWithInfoBlock("AAA"), "utf8");
    expect(deps.fs.writeFileSync).to.be.calledWithExactly("/dir/b.ts", wrapWithInfoBlock("BBB"), "utf8");
  });
});

function wrapWithInfoBlock(contents: string): string {
  return generateInfo("UNKNOWN", contents);
}
