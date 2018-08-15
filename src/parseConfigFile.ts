import { TDeps, TPluginCfg } from "./types";

export const parseConfigFile = ({ fs }: TDeps, path: string): TPluginCfg[] => {
  const config = fs.readFileSync(path, "utf-8");

  // assume that config is correctly formatter JUST FOR NOW

  return JSON.parse(config);
};
