/**
 * Configuration class for retrieving configuration values from various sources.
 */
export class Config {
  getDebugLoggingEnabled(): boolean {
    return process.env.DEBUG_LOGGING
      ? process.env.DEBUG_LOGGING.toLowerCase() === "true"
      : false;
  }
}
