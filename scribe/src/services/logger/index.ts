/**
 * Interface for logger object used across service.
 */
export interface Logger {
  info(log: LogInput): void;
  warn(log: LogInput): void;
  error(log: LogInput): void;
  debug(log: LogInput): void;
}

/**
 * Interface for log input provided to logger.
 */
export interface LogInput {
  message: string;
  data?: string;
}
