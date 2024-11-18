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

  private WriteEventLog(log: BasicLogInput) {
    process.stdout.write(JSON.stringify(log));
  }

  debug(log: LogInput): void {
    this.WriteEventLog({
      level: "debug",
      ...log,
    });
  }

  info(log: LogInput): void {
    this.WriteEventLog({
      level: "info",
      ...log,
    });
  }

  warn(log: LogInput): void {
    this.WriteEventLog({
      level: "warn",
      ...log,
    });
  }

  error(log: LogInput): void {
    this.WriteEventLog({
      level: "error",
      ...log,
    });
  }
}
