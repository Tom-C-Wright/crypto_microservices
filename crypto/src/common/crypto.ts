/**
 * Definition of cryptocurrency information services
 */
export interface CryptoInformationService {
    search(): Promise<void>
}

/**
 * Coin Gecko specific implementation of CryptoInformationService
 */
export class CoinGeckoService implements CryptoInformationService {
    search(): Promise<void> {
        throw new Error("Not implemented");
    }
}