import { TFileDesc } from "../src/publicApi";
import { processOutput } from "../src/tsGen";
import { unimock } from "./utils";
import { TDeps } from "../src/deps";
import { expect } from "chai";

describe("processOutput", () => {
  it("should do nothing when no files to process", () => {
    const deps = unimock<TDeps>({
      fs: undefined,
      prettier: undefined,
      logger: undefined,
      mkdirp: undefined,
    });

    processOutput(deps, undefined, undefined);
  });

  it("should work with single file", () => {
    const file: TFileDesc = { path: "/dir/a.ts", contents: "AAA" };

    const deps = unimock<TDeps>({
      fs: { writeFileSync: () => {} },
      prettier: { format: (contents: string) => contents },
      logger: { info: () => {} },
      mkdirp: (_path: string) => {},
    });

    processOutput(deps, undefined, file);

    expect(deps.mkdirp).to.be.calledOnce;
    expect(deps.mkdirp).to.be.calledWithExactly("/dir");

    expect(deps.prettier.format).to.be.calledOnce;
    expect(deps.prettier.format).to.be.calledWithExactly("AAA", { parser: "typescript" });

    expect(deps.fs.writeFileSync).to.be.calledOnce;
    expect(deps.fs.writeFileSync).to.be.calledWithExactly("/dir/a.ts", "AAA", "utf8");
  });

  it("should work with multiple files", () => {
    const files: TFileDesc[] = [{ path: "/dir/a.ts", contents: "AAA" }, { path: "/dir/b.ts", contents: "BBB" }];

    const deps = unimock<TDeps>({
      fs: { writeFileSync: () => {} },
      prettier: { format: (contents: string) => contents },
      logger: { info: () => {} },
      mkdirp: (_path: string) => {},
    });

    processOutput(deps, undefined, files);

    expect(deps.mkdirp).to.be.calledTwice;
    expect(deps.mkdirp).to.be.calledWithExactly("/dir");

    expect(deps.prettier.format).to.be.calledTwice;
    expect(deps.prettier.format).to.be.calledWithExactly("AAA", { parser: "typescript" });
    expect(deps.prettier.format).to.be.calledWithExactly("BBB", { parser: "typescript" });

    expect(deps.fs.writeFileSync).to.be.calledTwice;
    expect(deps.fs.writeFileSync).to.be.calledWithExactly("/dir/a.ts", "AAA", "utf8");
    expect(deps.fs.writeFileSync).to.be.calledWithExactly("/dir/b.ts", "BBB", "utf8");
  });
});
