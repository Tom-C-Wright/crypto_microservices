import { Logger, LogInput } from ".";

interface BasicLogInput extends LogInput {
  level: "debug" | "info" | "warn" | "error";
}

/**
 * Basic logging service for writing structured JSON logs to Basic.
 */
export class BasicLogger implements Logger {
  protected debugLogging: boolean;

  constructor(params: { debugLoggingEnabled: boolean }) {
    this.debugLogging = params.debugLoggingEnabled;
  }

  private writeLog(log: BasicLogInput) {
    process.stdout.write(JSON.stringify(log));
  }

  debug(log: LogInput): void {
    this.writeLog({
      level: "debug",
      ...log,
    });
  }

  info(log: LogInput): void {
    this.writeLog({
      level: "info",
      ...log,
    });
  }

  warn(log: LogInput): void {
    this.writeLog({
      level: "warn",
      ...log,
    });
  }

  error(log: LogInput): void {
    this.writeLog({
      level: "error",
      ...log,
    });
  }
}
