import { TPlugin, TFileDesc, TContext } from "../../../src/types";
import { copyRuntime, abiToWrapper } from "typechain";
import { getFilenameWithoutAnyExtensions, getRelativeModulePath } from "../../../src";
import { parse, join } from "path";
import { sync as mkdirp } from "mkdirp";

interface TOptions {
  runtimePath: string;
  output?: string;
}

export default class Typechain implements TPlugin {
  private readonly runtimePathAbs: string;
  private readonly genPath?: string;
  constructor({ cwd, config }: TContext) {
    this.runtimePathAbs = join(cwd, config.runtimePath);
    this.genPath = config.output && join(cwd, config.output);
  }

  init(): void {
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
