import { getFilenameWithoutAnyExtensions, getRelativeModulePath } from "../src/utils";
import { expect } from "chai";

describe("utils", () => {
  describe("getFilenameWithoutAnyExtensions", () => {
    it("should work with simple path", () => {
      expect(getFilenameWithoutAnyExtensions("/test/file.txt")).to.be.eq("/test/file");
    });

    it("should work with double extension", () => {
      expect(getFilenameWithoutAnyExtensions("/test/file.txt.ts")).to.be.eq("/test/file");
    });
  });

  describe("getRelativeModulePath", () => {
    it("should work in the same directory", () => {
      const cwd = "/app/index.ts";
      const to = "/app/module2.ts";

      expect(getRelativeModulePath(cwd, to)).to.be.eq("./module2");
    });

    it("should work in different directories", () => {
      const cwd = "/app2/index.ts";
      const to = "/app/module2.ts";

      expect(getRelativeModulePath(cwd, to)).to.be.eq("./../app/module2");
    });
  });
});
