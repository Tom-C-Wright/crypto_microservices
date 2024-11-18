import { AppStatus, Client, ClientResponse } from "../../common/client";
import { Config } from "../../services/config";
import { CryptoInformationService } from "../../services/cryptoInformation";
import { CoinGeckoService } from "../../services/cryptoInformation/coingecko";
import { EmailService } from "../../services/email";
import { SesEmailService } from "../../services/email/simpleEmailService";
import { Logger } from "../../services/logger";
import { BasicLogger } from "../../services/logger/cloudwatch";
import { EmailPriceRequestBody } from "./models";

/**
 * Client responsible for handling the logic for the Email Price handler.
 */
export class EmailPriceClient implements Client<EmailPriceRequestBody, void> {
  // Services
  protected logger: Logger;
  protected cryptoInformationService: CryptoInformationService;
  protected emailService: EmailService;

  protected senderEmail: string;

  constructor(params: {
    logger: Logger;
    cryptoInformationService: CryptoInformationService;
    emailService: EmailService;
    senderEmail: string;
  }) {
    this.logger = params.logger;
    this.cryptoInformationService = params.cryptoInformationService;
    this.emailService = params.emailService;
    this.senderEmail = params.senderEmail;
  }

  async handle(request: EmailPriceRequestBody): Promise<ClientResponse<void>> {
    try {
      if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(request.email)) {
        return {
          status: AppStatus.ERROR,
        };
      }

      const searchResults = await this.cryptoInformationService.search({
        query: request.coin,
      });

      this.logger.debug({
        message: "Crypto Search Results",
        // Only log first 10 results to prevent cloudwatch log bloat.
        data: JSON.stringify(searchResults.slice(-10)),
      });

      // Find the first exact match on any of the returned identifiers.
      const queryMatch = searchResults.find(
        (result) =>
          result.id === request.coin ||
          result.name === request.coin ||
          result.symbol === request.coin
      );

      if (!queryMatch) {
        this.logger.debug({
          message: `Unable to find match on query parameter.`,
          data: `Query: ${request.coin}`,
        });

        return {
          status: AppStatus.NOT_FOUND,
        };
      }

      const coinDetails = await this.cryptoInformationService.fetchCoinDetails({
        id: queryMatch.id,
      });

      this.logger.debug({
        message: "Coin details",
        // Only log first 10 results to prevent cloudwatch log bloat.
        data: JSON.stringify(coinDetails),
      });

      if (!coinDetails) {
        return {
          status: AppStatus.ERROR,
        };
      }

      const price = coinDetails.marketData.priceData["aud"] || "";
      let emailBody = "";

      if (!price) {
        emailBody = `Unable to find price in AUD for ${coinDetails.name}`;
      } else {
        emailBody = `Current price of ${coinDetails.name} is ${price}`;
      }

      await this.emailService.sendEmail({
        to: request.email,
        from: this.senderEmail,
        subject: "Crypto Currency Price Inquiry",
        body: emailBody,
      });

      return {
        status: AppStatus.SUCCESS,
      };
    } catch (error) {
      this.logger.error({
        message: "Error occurred handling price inquiry.",
        data: (error as Error).message,
      });

      return {
        status: AppStatus.ERROR,
      };
    }
  }
}

/**
 * Helper function for initializing Email Price client.
 */
export function buildEmailPriceClient(): EmailPriceClient {
  // TODO build a centralised service to instantiate different services based on config values.
  const config = new Config();

  const basicLogger = new BasicLogger({
    debugLoggingEnabled: config.getDebugLoggingEnabled(),
  });

  if (!config.getCoinGeckoApiKey()) {
    throw new Error("Coingecko API key missing from environment variables");
  }

  if (!config.getCoinGeckoBaseUrl()) {
    throw new Error("Coingecko base url missing from environment variables");
  }

  if (!config.getSenderEmail()) {
    throw new Error("Sender email missing from environment variables");
  }

  const coinGeckoService = new CoinGeckoService({
    logger: basicLogger,
    apiKey: config.getCoinGeckoApiKey(),
    baseUrl: config.getCoinGeckoBaseUrl(),
  });

  const sesEmailService = new SesEmailService({
    logger: basicLogger,
  });

  return new EmailPriceClient({
    logger: basicLogger,
    cryptoInformationService: coinGeckoService,
    emailService: sesEmailService,
    senderEmail: config.getSenderEmail(),
  });
}
