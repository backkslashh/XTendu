const yahooFinance = require('yahoo-finance2').default;

class StockInfo {
    /**
     * Creates an instance of StockInfo.
     * @param {string} acronym - The stock ticker symbol (e.g., "AAPL").
     * @param {string} companyfullname - The full name of the company (e.g., "Apple Inc.").
     * @param {number} price - The current stock price.
     * @param {string} currency - The currency of the stock price (e.g., "USD").
     * @param {Date} timestamp - The time of the last price update.
     */
    constructor(acronym, companyfullname, price, currency, timestamp) {
        this.acronym = acronym;
        this.companyfullname = companyfullname;
        this.price = price;
        this.currency = currency;
        this.timestamp = timestamp;
    }
}

class StockInfoFetcher {
    /**
     * Fetches stock information for a given acronym.
     * @param {string} acronym - The stock ticker symbol (e.g., "AAPL" for "Apple").
     * @returns {Promise<StockInfo>} A promise that resolves to a StockInfo object.
     * @throws {Error} If the acronym is invalid or data cannot be retrieved.
     */
    async getStockInfo(acronym) {
        const quote = await yahooFinance.quote(acronym);
        const companyfullname = quote.longName || quote.shortName || "Unknown";
        const price = quote.regularMarketPrice;
        const currency = quote.currency;
        const timestamp = new Date(quote.regularMarketTime * 1000);
        return new StockInfo(acronym, companyfullname, price, currency, timestamp);
    }
}

module.exports = {
    StockInfo,
    StockInfoFetcher
};