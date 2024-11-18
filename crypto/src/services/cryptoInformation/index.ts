/**
 * Definition of cryptocurrency information services
 */
export interface CryptoInformationService {
  search(params: { query: string }): Promise<CryptoSearchResult[]>;
  fetchCoinDetails(params: { id: string }): Promise<CryptoCoinDetails>;
}

/**
 * Cryptocurrency coin details object.
 */
export interface CryptoCoinDetails {
  id: string;
  name: string;
  symbol: string;
  marketData: {
    priceData: Record<CurrencyCode, number>;
  };
}

/**
 * Singular result object returned by CryptoInformation search request.
 */
export interface CryptoSearchResult {
  id: string;
  name: string;
  symbol: string;
}

/**
 * Type for relevant currency code values used in 'crypto'
 */
export type CurrencyCode = "aud" | "usd" | "btc";
