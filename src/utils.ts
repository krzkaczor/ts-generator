import { relative } from "path";

export function getFilenameWithoutAnyExtensions(filePath: string): string {
  const endPosition = filePath.indexOf(".");
  return filePath.slice(0, endPosition !== -1 ? endPosition : filePath.length);
}

export function getRelativeModulePath(from: string, to: string): string {
  return ("./" + relative(from, to)).replace(".ts", ""); // @note: this is probably not the best way to find relative path for modules
}
