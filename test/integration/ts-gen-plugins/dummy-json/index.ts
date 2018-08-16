import { TPlugin, TFileDesc } from "../../../../src/publicApi";

const generateType = (name: string, type: string): string => `export const ${name}: ${type}`;

export default class JsonPlugin implements TPlugin {
  init(): void {}

  transformFile({ path, contents }: TFileDesc): TFileDesc[] {
    const outputFileName = `${path}.d.ts`;

    const json = JSON.parse(contents);

    // assume that json is 1 level nested structure
    const nameTypePairs = Object.keys(json).map(k => {
      const value = json[k];
      const valueType = typeof value;

      return [k, valueType] as [string, string];
    });

    const types = nameTypePairs.map(([name, type]) => generateType(name, type)).join("\n");

    return [
      {
        contents: types,
        path: outputFileName,
      },
    ];
  }
}
