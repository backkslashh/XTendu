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

    /**
     * Returns a string representation of the StockInfo object.
     * @returns {string} A string representation of the StockInfo object.
     */
    toString() {
        return `${this.companyfullname} (${this.acronym}): ${this.price} ${this.currency} as of ${this.timestamp}`;
    }

    /**
     * Returns a JSON representation of the StockInfo object.
     * @returns {object} A JSON representation of the StockInfo object.
     */
    toJSON() {
        return {
            acronym: this.acronym,
            companyfullname: this.companyfullname,
            price: this.price,
            currency: this.currency,
            timestamp: this.timestamp.toISOString()
        };
    }

    /**
     * Formats the price with proper decimal places
     * @param {number} [decimalPlaces=2] - Number of decimal places to display
     * @returns {string} Formatted price string
     */
    getFormattedPrice(decimalPlaces = 2) {
        return this.price.toFixed(decimalPlaces);
    }

    /**
     * Returns price with currency symbol
     * @returns {string} Price with currency symbol
     */
    getPriceWithCurrency() {
        const currencySymbols = {
            USD: '$', 
            EUR: '€',
            GBP: '£',
            JPY: '¥',
            // Add more currencies as needed
        };
        const symbol = currencySymbols[this.currency] || this.currency;
        return `${symbol}${this.getFormattedPrice()}`;
    }

    /**
     * Formats the timestamp in a user-friendly way
     * @param {string} [locale='en-US'] - The locale to use for formatting
     * @returns {string} Formatted timestamp
     */
    getFormattedTimestamp(locale = 'en-US') {
        return this.timestamp.toLocaleString(locale);
    }

    /**
     * Calculates time elapsed since the last update
     * @returns {string} Human-readable time elapsed
     */
    getTimeSinceUpdate() {
        const now = new Date();
        const diffMs = now - this.timestamp;
        const diffSec = Math.floor(diffMs / 1000);
        
        if (diffSec < 60) return `${diffSec} seconds ago`;
        
        const diffMin = Math.floor(diffSec / 60);
        if (diffMin < 60) return `${diffMin} minutes ago`;
        
        const diffHr = Math.floor(diffMin / 60);
        if (diffHr < 24) return `${diffHr} hours ago`;
        
        const diffDays = Math.floor(diffHr / 24);
        return `${diffDays} days ago`;
    }

    /**
     * Calculates percentage change from a previous price
     * @param {number} previousPrice - The previous stock price
     * @returns {number} The percentage change
     */
    calculatePercentageChange(previousPrice) {
        if (!previousPrice || previousPrice <= 0) {
            throw new Error('Previous price must be a positive number');
        }
        return ((this.price - previousPrice) / previousPrice) * 100;
    }

    /**
     * Creates a clone of this StockInfo object
     * @returns {StockInfo} A new StockInfo instance with the same values
     */
    clone() {
        return new StockInfo(
            this.acronym,
            this.companyfullname,
            this.price,
            this.currency,
            new Date(this.timestamp)
        );
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