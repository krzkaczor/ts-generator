/* tslint:disable:no-console */
import chalk from "chalk";
import { UnionDictionary } from "./stl";

const { gray, green, yellow, red } = chalk;

type TLoggerFunction = (...args: any[]) => void;
export type TLoggerLvl = "info" | "verbose" | "error";

const loggerLvlToNumber: UnionDictionary<TLoggerLvl, number> = {
  verbose: 2,
  info: 1,
  error: 0,
};

export interface TLogger {
  info: TLoggerFunction;
  verbose: TLoggerFunction;
  error: TLoggerFunction;
  warn: TLoggerFunction;

  accent(s: string): string;
  childLogger(name: string): TLogger;
  lvl: TLoggerLvl;
}

export class ConsoleLogger implements TLogger {
  constructor(private name: string, public lvl: TLoggerLvl) {}

  private prefix(): string {
    return `${gray(this.name)}:`;
  }

  info(...args: any[]): void {
    if (loggerLvlToNumber["info"] >= loggerLvlToNumber[this.lvl]) {
      console.info(this.prefix(), ...args);
    }
  }

  verbose(...args: any[]): void {
    if (loggerLvlToNumber["verbose"] >= loggerLvlToNumber[this.lvl]) {
      console.info(this.prefix(), ...args);
    }
  }

  error(...args: any[]): void {
    if (loggerLvlToNumber["error"] >= loggerLvlToNumber[this.lvl]) {
      console.error(this.prefix(), ...args.map(m => red(m)));
    }
  }

  warn(...args: any[]): void {
    console.info(this.prefix(), ...args.map(m => yellow(m)));
  }

  accent(s: string): string {
    return green(s);
  }

  childLogger(name: string): TLogger {
    return new ConsoleLogger(name, this.lvl);
  }
}

export class NoLogger implements TLogger {
  lvl: TLoggerLvl = "error";
  info(): void {}
  verbose(): void {}
  error(): void {}
  warn(): void {}

  accent(s: string): string {
    return s;
  }
  childLogger(): TLogger {
    return new NoLogger();
  }
}
