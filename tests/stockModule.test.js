const { StockInfoFetcher } = require('../src/utils/stockModule');
const yahooFinance = require('yahoo-finance2').default;

// Mock the yahooFinance module to avoid real API calls
jest.mock('yahoo-finance2');

describe('StockInfoFetcher', () => {
    let fetcher;

    beforeEach(() => {
        fetcher = new StockInfoFetcher();
    });

    it('should fetch and return stock information correctly', async () => {
        const mockQuote = {
            longName: 'Apple Inc.',
            regularMarketPrice: 175.32,
            currency: 'USD',
            regularMarketTime: 1696500000 // Unix timestamp in seconds
        };
        yahooFinance.quote.mockResolvedValue(mockQuote);

        const acronym = 'AAPL';
        const stockInfo = await fetcher.getStockInfo(acronym);

        // Convert timestamp to Date object (seconds to milliseconds)
        const expectedTimestamp = new Date(1696500000 * 1000);

        // Assertions
        expect(stockInfo.acronym).toBe(acronym);
        expect(stockInfo.companyfullname).toBe('Apple Inc.');
        expect(stockInfo.price).toBe(175.32);
        expect(stockInfo.currency).toBe('USD');
        expect(stockInfo.timestamp).toEqual(expectedTimestamp);
    });

    it('should handle missing longName and use shortName', async () => {
        const mockQuote = {
            shortName: 'Apple',
            regularMarketPrice: 175.32,
            currency: 'USD',
            regularMarketTime: 1696500000
        };
        yahooFinance.quote.mockResolvedValue(mockQuote);

        const acronym = 'AAPL';
        const stockInfo = await fetcher.getStockInfo(acronym);

        expect(stockInfo.companyfullname).toBe('Apple');
    });

    it('should handle missing longName and shortName', async () => {
        const mockQuote = {
            regularMarketPrice: 175.32,
            currency: 'USD',
            regularMarketTime: 1696500000
        };
        yahooFinance.quote.mockResolvedValue(mockQuote);

        const acronym = 'AAPL';
        const stockInfo = await fetcher.getStockInfo(acronym);

        expect(stockInfo.companyfullname).toBe('Unknown');
    });

    it('should throw an error for invalid acronym', async () => {
        yahooFinance.quote.mockRejectedValue(new Error('Invalid symbol'));

        const acronym = 'INVALID';
        await expect(fetcher.getStockInfo(acronym)).rejects.toThrow('Invalid symbol');
    });
});