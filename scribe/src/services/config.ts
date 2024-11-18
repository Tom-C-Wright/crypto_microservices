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

  getRdsPassowrd(): string {
    return process.env.RDS_PASSWORD || "";
  }

  getRdsPort(): string {
    return process.env.RDS_PORT || "";
  }
}
