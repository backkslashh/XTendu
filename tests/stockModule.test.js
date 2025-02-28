const { StockInfoFetcher, StockInfo } = require('../src/utils/stockModule');
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

describe('StockInfo', () => {
    it('should format toString representation correctly', () => {
        const acronym = 'AAPL';
        const companyfullname = 'Apple Inc.';
        const price = 175.32;
        const currency = 'USD';
        const timestamp = new Date('2023-10-05T12:00:00Z');
        
        const stockInfo = new StockInfo(acronym, companyfullname, price, currency, timestamp);
        
        const expected = `${companyfullname} (${acronym}): ${price} ${currency} as of ${timestamp}`;
        expect(stockInfo.toString()).toBe(expected);
    });

    it('should include all information in toString output', () => {
        const acronym = 'TSLA';
        const companyfullname = 'Tesla Inc.';
        const price = 245.78;
        const currency = 'USD';
        const timestamp = new Date('2023-10-05T15:30:00Z');
        
        const stockInfo = new StockInfo(acronym, companyfullname, price, currency, timestamp);
        const output = stockInfo.toString();
        
        expect(output).toContain(acronym);
        expect(output).toContain(companyfullname);
        expect(output).toContain(price.toString());
        expect(output).toContain(currency);
        expect(output).toContain(timestamp.toString());
    });

    it('should convert to JSON correctly', () => {
        const acronym = 'AAPL';
        const companyfullname = 'Apple Inc.';
        const price = 175.32;
        const currency = 'USD';
        const timestamp = new Date('2023-10-05T12:00:00Z');
        
        const stockInfo = new StockInfo(acronym, companyfullname, price, currency, timestamp);
        const json = stockInfo.toJSON();
        
        expect(json).toEqual({
            acronym,
            companyfullname,
            price,
            currency,
            timestamp: timestamp.toISOString()
        });
    });

    it('should format price with correct decimal places', () => {
        const stockInfo = new StockInfo('AAPL', 'Apple Inc.', 175.32678, 'USD', new Date());
        
        expect(stockInfo.getFormattedPrice()).toBe('175.33'); // Default 2 decimal places
        expect(stockInfo.getFormattedPrice(3)).toBe('175.327');
        expect(stockInfo.getFormattedPrice(0)).toBe('175');
    });
    
    it('should return price with currency symbol', () => {
        const stockInfoUSD = new StockInfo('AAPL', 'Apple Inc.', 175.32, 'USD', new Date());
        const stockInfoEUR = new StockInfo('AAPL', 'Apple Inc.', 160.45, 'EUR', new Date());
        const stockInfoGBP = new StockInfo('AAPL', 'Apple Inc.', 140.25, 'GBP', new Date());
        const stockInfoUnknown = new StockInfo('AAPL', 'Apple Inc.', 175.32, 'XYZ', new Date());
        
        expect(stockInfoUSD.getPriceWithCurrency()).toBe('$175.32');
        expect(stockInfoEUR.getPriceWithCurrency()).toBe('€160.45');
        expect(stockInfoGBP.getPriceWithCurrency()).toBe('£140.25');
        expect(stockInfoUnknown.getPriceWithCurrency()).toBe('XYZ175.32');
    });
    
    it('should format timestamp correctly', () => {
        const timestamp = new Date('2023-10-05T12:00:00Z');
        const stockInfo = new StockInfo('AAPL', 'Apple Inc.', 175.32, 'USD', timestamp);
        
        // Test result will depend on the locale of the testing environment
        expect(stockInfo.getFormattedTimestamp()).toBe(timestamp.toLocaleString('en-US'));
        expect(stockInfo.getFormattedTimestamp('de-DE')).toBe(timestamp.toLocaleString('de-DE'));
    });
    
    it('should calculate time since update', () => {
        jest.useFakeTimers();
        const now = new Date('2023-10-05T12:00:00Z');
        jest.setSystemTime(now);
        
        // Test seconds
        const secondsAgo = new Date(now.getTime() - 30 * 1000);
        let stockInfo = new StockInfo('AAPL', 'Apple Inc.', 175.32, 'USD', secondsAgo);
        expect(stockInfo.getTimeSinceUpdate()).toBe('30 seconds ago');
        
        // Test minutes
        const minutesAgo = new Date(now.getTime() - 45 * 60 * 1000);
        stockInfo = new StockInfo('AAPL', 'Apple Inc.', 175.32, 'USD', minutesAgo);
        expect(stockInfo.getTimeSinceUpdate()).toBe('45 minutes ago');
        
        // Test hours
        const hoursAgo = new Date(now.getTime() - 5 * 60 * 60 * 1000);
        stockInfo = new StockInfo('AAPL', 'Apple Inc.', 175.32, 'USD', hoursAgo);
        expect(stockInfo.getTimeSinceUpdate()).toBe('5 hours ago');
        
        // Test days
        const daysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
        stockInfo = new StockInfo('AAPL', 'Apple Inc.', 175.32, 'USD', daysAgo);
        expect(stockInfo.getTimeSinceUpdate()).toBe('3 days ago');
        
        jest.useRealTimers();
    });
    
    it('should calculate percentage change correctly', () => {
        const stockInfo = new StockInfo('AAPL', 'Apple Inc.', 175.32, 'USD', new Date());
        
        expect(stockInfo.calculatePercentageChange(170)).toBeCloseTo(3.13, 2);
        expect(stockInfo.calculatePercentageChange(200)).toBeCloseTo(-12.34, 2);
    });
    
    it('should throw error for invalid previous price', () => {
        const stockInfo = new StockInfo('AAPL', 'Apple Inc.', 175.32, 'USD', new Date());
        
        expect(() => stockInfo.calculatePercentageChange(0)).toThrow('Previous price must be a positive number');
        expect(() => stockInfo.calculatePercentageChange(-10)).toThrow('Previous price must be a positive number');
        expect(() => stockInfo.calculatePercentageChange(null)).toThrow('Previous price must be a positive number');
    });
    
    it('should create a clone with the same values', () => {
        const timestamp = new Date('2023-10-05T12:00:00Z');
        const original = new StockInfo('AAPL', 'Apple Inc.', 175.32, 'USD', timestamp);
        
        const clone = original.clone();
        
        // Values should be equal...
        expect(clone.acronym).toBe(original.acronym);
        expect(clone.companyfullname).toBe(original.companyfullname);
        expect(clone.price).toBe(original.price);
        expect(clone.currency).toBe(original.currency);
        expect(clone.timestamp).toEqual(original.timestamp);
        
        // ...but they should be different objects
        expect(clone).not.toBe(original);
        expect(clone.timestamp).not.toBe(original.timestamp);
    });
});
