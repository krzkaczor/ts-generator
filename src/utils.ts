import { relative } from "path";

export function getFilenameWithoutAnyExtensions(filePath: string): string {
  const endPosition = filePath.indexOf(".");
  return filePath.slice(0, endPosition !== -1 ? endPosition : filePath.length);
}

export function getRelativeModulePath(cwd: string, to: string): string {
  return ("./" + relative(cwd, to)).replace(".ts", ""); // @note(kk): any better way to find it?
}
