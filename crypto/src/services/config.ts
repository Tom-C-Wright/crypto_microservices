/**
 * Configuration class for retrieving configuration values from various sources.
 */
export class Config {
  getSenderEmail(): string {
    return process.env.SENDER_EMAIL || "";
  }

  getDebugLoggingEnabled(): boolean {
    return process.env.DEBUG_LOGGING
      ? process.env.DEBUG_LOGGING.toLowerCase() === "true"
      : false;
  }

  getCoinGeckoApiKey(): string {
    return process.env.COINGECKO_API_KEY || "";
  }

  getCoinGeckoBaseUrl(): string {
    return "https://api.coingecko.com/api/v3";
  }
}
