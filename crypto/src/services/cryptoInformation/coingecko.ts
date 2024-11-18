import {
  CryptoCoinDetails,
  CryptoInformationService,
  CryptoSearchResult,
  CurrencyCode,
} from ".";
import { Logger } from "../logger";

interface CoinGeckoSearchResponse {
  coins: [
    {
      id: string;
      name: string;
      api_symbol: string;
      symbol: string;
      market_cap_rank: number;
      thumb: string;
      large: string;
    }
  ];
}

type CoinGeckoCoinDetailsResponse = Omit<CryptoCoinDetails, "marketData"> & {
  market_data: {
    current_price: Record<string, number>;
  };
};

/**
 * Coin Gecko specific implementation of CryptoInformationService
 */
export class CoinGeckoService implements CryptoInformationService {
  // Properties
  protected apiKey: string;
  protected baseUrl: string;

  // Services
  protected logger: Logger;

  constructor(params: { logger: Logger; apiKey: string; baseUrl: string }) {
    this.apiKey = params.apiKey;
    this.logger = params.logger;
    this.baseUrl = params.baseUrl;
  }

  async fetchCoinDetails(params: { id: string }): Promise<CryptoCoinDetails> {
    try {
      const response = await fetch(`${this.baseUrl}/coins/${params.id}`, {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      });

      const responseText = await response.text();

      if (!response.ok) {
        this.logger.debug({
          message: "Coin Gecko /coins/id response",
          data: `${response.status} :${response.statusText}\n${responseText}`,
        });

        throw new Error("Error fetching coin details from Coin Gecko.");
      }

      const responseBody = JSON.parse(
        responseText
      ) as CoinGeckoCoinDetailsResponse;

      return {
        id: responseBody.id,
        name: responseBody.name,
        symbol: responseBody.symbol,
        marketData: {
          priceData: responseBody.market_data.current_price,
        },
      };
    } catch (error) {
      this.logger.error({
        message: "Error returned fetching coin from coingecko",
        data: (error as Error).message,
      });

      throw error;
    }
  }

  async search(params: { query: string }): Promise<CryptoSearchResult[]> {
    // Early return on empty search query.
    if (!params.query) {
      this.logger.warn({
        message: "Empty search query passed to CoinGeckoService.search",
      });

      return [];
    }

    const response = await fetch(
      `${this.baseUrl}/search?query=${params.query}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-cg-demo-api-key": this.apiKey,
        },
      }
    );

    const responseText = await response.text();

    this.logger.debug({
      message: "Coin Gecko /search response",
      data: `${response.status} :${response.statusText}\n${responseText}`,
    });

    const responseBody = JSON.parse(responseText) as CoinGeckoSearchResponse;

    return responseBody.coins.map((coin) => {
      return {
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
      };
    });
  }
}
