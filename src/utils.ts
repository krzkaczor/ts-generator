import { relative, dirname, extname } from "path";

export function getFilenameWithoutAnyExtensions(filePath: string): string {
  const endPosition = filePath.indexOf(".");
  return filePath.slice(0, endPosition !== -1 ? endPosition : filePath.length);
}

/**
 * Both paths have to be file paths, not directories!
 * @param from
 * @param to
 */
export function getRelativeModulePath(from: string, to: string): string {
  const fromDir = dirname(from);
  const relativePathWithExtension = "./" + relative(fromDir, to);

  const extension = extname(relativePathWithExtension);
  const relativePathWithoutExtension = relativePathWithExtension.slice(0, -extension.length);

  return relativePathWithoutExtension;
}
