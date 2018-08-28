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
  constructor(ctx: TContext) {
    super(ctx);

    const { cwd, rawConfig } = ctx;
    this.runtimePathAbs = join(cwd, rawConfig.runtimePath);
    this.genPath = rawConfig.output && join(cwd, rawConfig.output);
  }

  beforeRun(): void {
    if (this.genPath) {
      mkdirp(this.genPath);
    }
    copyRuntime(this.runtimePathAbs);
  }

  transformFile(fd: TFileDesc): TFileDesc[] {
    const pathDetails = parse(fd.path);
    const outputDir = this.genPath || pathDetails.dir;

    const contractName = getFilenameWithoutAnyExtensions(pathDetails.name);
    const abi = JSON.parse(fd.contents);
    const relativeRuntimePath = getRelativeModulePath(outputDir, this.runtimePathAbs);

    const types = abiToWrapper(abi, {
      fileName: contractName,
      relativeRuntimePath,
    });

    return [
      {
        path: join(outputDir, contractName + ".ts"),
        contents: types,
      },
    ];
  }
}
