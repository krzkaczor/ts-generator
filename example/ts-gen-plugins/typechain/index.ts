import { copyRuntime, abiToWrapper } from "typechain";
import { parse, join } from "path";
import { sync as mkdirp } from "mkdirp";

import {
  getFilenameWithoutAnyExtensions,
  getRelativeModulePath,
  TFileDesc,
  TContext,
  TsGeneratorPlugin,
} from "ts-generator";

interface TOptions {
  runtimePath: string;
  output?: string;
}

export default class Typechain extends TsGeneratorPlugin {
  name = "Typechain";

  private readonly runtimePathAbs: string;
  private readonly genPath?: string;
  constructor(ctx: TContext<TOptions>) {
    super(ctx);

    const { cwd, rawConfig } = ctx;
    this.runtimePathAbs = join(cwd, rawConfig.runtimePath);
    this.genPath = rawConfig.output && join(cwd, rawConfig.output);
  }

  beforeRun(): void {
    if (this.genPath) {
      mkdirp(this.genPath);
    }
    this.logger.info("Copied runtime");
    copyRuntime(this.runtimePathAbs);
  }

  transformFile(fd: TFileDesc): TFileDesc {
    const pathDetails = parse(fd.path);
    const outputDir = this.genPath || pathDetails.dir;

    const contractName = getFilenameWithoutAnyExtensions(pathDetails.name);
    const outputPath = join(outputDir, `${contractName}.ts`);

    const abi = JSON.parse(fd.contents);
    const relativeRuntimePath = getRelativeModulePath(outputPath, this.runtimePathAbs);

    const types = abiToWrapper(abi, {
      fileName: contractName,
      relativeRuntimePath,
    });

    return {
      path: outputPath,
      contents: types,
    };
  }
}
