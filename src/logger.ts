/* tslint:disable:no-console */
type TLoggerFunction = (...args: any[]) => void;

export interface TLogger {
  info: TLoggerFunction;
  error: TLoggerFunction;
  warn: TLoggerFunction;
}

export class ConsoleLogger implements TLogger {
  constructor(private isSilent: boolean) {}

  info(...args: any[]): void {
    if (!this.isSilent) {
      console.info(...args);
    }
  }

  error(...args: any[]): void {
    console.info(...args);
  }

  warn(...args: any[]): void {
    console.info(...args);
  }
}

export class NoLogger implements TLogger {
  info(): void {}
  error(): void {}
  warn(): void {}
}
