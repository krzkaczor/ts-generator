import { TDeps } from "../deps";
import { TOutputTransformer } from ".";
import { join } from "path";

export const infoOutputTransformer: TOutputTransformer = (output, deps) => {
  const version = getPackageVersion(deps);
  return generateInfo(version, output);
};

export function generateInfo(_version: string, output: string): string {
  return [
    "/* Autogenerated file. Do not edit manually. */",
    "/* tslint:disable */",
    "/* eslint-disable */",
    output,
  ].join("\n");
}

function getPackageVersion({ fs }: TDeps): string {
  const packageJsonPath = join(__dirname, "../../package.json");

  return JSON.parse(fs.readFileSync(packageJsonPath, "utf8")).version || "UNKNOWN";
}
