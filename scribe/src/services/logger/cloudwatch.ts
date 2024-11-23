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

  private WriteLog(log: BasicLogInput) {
    process.stdout.write(JSON.stringify(log) + `\n`);
  }

  debug(log: LogInput): void {
    this.WriteLog({
      level: "debug",
      ...log,
    });
  }

  info(log: LogInput): void {
    this.WriteLog({
      level: "info",
      ...log,
    });
  }

  warn(log: LogInput): void {
    this.WriteLog({
      level: "warn",
      ...log,
    });
  }

  error(log: LogInput): void {
    this.WriteLog({
      level: "error",
      ...log,
    });
  }
}
