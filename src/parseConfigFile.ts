import { TDeps } from "./deps";

export interface TPluginCfg {
  files: string;
  generator: string;
  [key: string]: any;
}

export const parseConfigFile = ({ fs }: TDeps, path: string): TPluginCfg[] => {
  const config = fs.readFileSync(path, "utf-8");

  // assume that config is correctly formatted JUST FOR NOW

  return JSON.parse(config);
};
