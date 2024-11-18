/**
 * Configuration class for retrieving configuration values from various sources.
 */
export class Config {
  getDebugLoggingEnabled(): boolean {
    return process.env.DEBUG_LOGGING
      ? process.env.DEBUG_LOGGING.toLowerCase() === "true"
      : false;
  }

  getRdsHostname(): string {
    return process.env.RDS_HOSTNAME || "";
  }

  getRdsUsername(): string {
    return process.env.RDS_USERNAME || "";
  }

  getRdsPassword(): string {
    return process.env.RDS_PASSWORD || "";
  }

  getRdsPort(): number {
    return parseInt(process.env.RDS_PORT || "3000");
  }

  getEventLogDatabaseName(): string {
    return process.env.EVENT_LOG_DB_NAME || "";
  }
}
