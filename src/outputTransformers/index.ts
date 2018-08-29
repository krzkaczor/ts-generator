import { TDeps } from "../deps";
import { TCfg } from "../parseConfigFile";
import { infoOutputTransformer } from "./info";
import { prettierOutputTransformer } from "./prettier";

export type TOutputTransformer = (output: string, deps: TDeps, cfg: TCfg) => string;

export const outputTransformers = [infoOutputTransformer, prettierOutputTransformer];
