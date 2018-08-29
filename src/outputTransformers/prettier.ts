import { Options as PrettierOptions } from "prettier";

import { TOutputTransformer } from ".";

export const prettierOutputTransformer: TOutputTransformer = (output, { prettier }, cfg) => {
  const prettierCfg: PrettierOptions = { ...(cfg.prettier || {}), parser: "typescript" };

  return prettier.format(output, prettierCfg);
};
