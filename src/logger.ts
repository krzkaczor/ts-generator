/* tslint:disable:no-console */
import chalk from "chalk";

const { gray, green, yellow, red } = chalk;

type TLoggerFunction = (...args: any[]) => void;
type TLoggerLvl = "normal" | "verbose";

export interface TLogger {
  info: TLoggerFunction;
  verbose: TLoggerFunction;
  error: TLoggerFunction;
  warn: TLoggerFunction;

  accent(s: string): string;
  childLogger(name: string): TLogger;
}

export class ConsoleLogger implements TLogger {
  constructor(private name: string, private lvl: TLoggerLvl) {}

  private prefix(): string {
    return `${gray(this.name)}:`;
  }

  info(...args: any[]): void {
    console.info(this.prefix(), ...args);
  }

  verbose(...args: any[]): void {
    if (this.lvl === "verbose") {
      console.info(this.prefix(), ...args);
    }
  }

  error(...args: any[]): void {
    console.error(this.prefix(), ...args.map(m => red(m)));
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
