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

    /**
     * Fetches historical stock information for a given acronym at a specific timestamp.
     * @param {string} acronym - The stock ticker symbol (e.g., "AAPL").
     * @param {Date} timestamp - The historical date to fetch data for.
     * @returns {Promise<StockInfo>} A promise that resolves to a StockInfo object.
     * @throws {Error} If the acronym is invalid, data cannot be retrieved, or stock wasn't available at the timestamp.
     */
    async getHistoricalStockInfo(acronym, timestamp) {
        try {
            const queryDate = timestamp.toISOString().split('T')[0]; // Format as YYYY-MM-DD

            const historicalData = await yahooFinance.historical(acronym, {
                period1: timestamp,
                period2: new Date(timestamp.getTime() + 24 * 60 * 60 * 1000) // Next day
            });

            if (!historicalData || historicalData.length === 0) {
                throw new Error(`No stock data available for ${acronym} on ${queryDate}`);
            }

            // Get the closest data point to the requested timestamp
            const dataPoint = historicalData[0];

            const quoteData = await yahooFinance.quote(acronym);
            const companyName = quoteData.longName || quoteData.shortName || "Unknown";

            return new StockInfo(
                acronym,
                companyName,
                dataPoint.close, // Using closing price
                quoteData.currency,
                new Date(dataPoint.date)
            );
        } catch (error) {
            if (error.message.includes('No stock data available')) {
                throw error;
            }
            if (error.statusCode === 404 || error.name === 'HistoricalError') {
                throw new Error(`${acronym} was not publicly traded on the requested date`);
            }
            throw new Error(`Failed to fetch historical data for ${acronym}: ${error.message}`);
        }
    }

    /**
     * Fetches stock information for a given date string.
     * @param {string} acronym - The stock ticker symbol (e.g., "AAPL").
     * @param {string} dateString - Date string in YYYY-MM-DD format.
     * @returns {Promise<StockInfo>} A promise that resolves to a StockInfo object.
     */
    async getStockInfoByDateString(acronym, dateString) {
        const timestamp = new Date(dateString);
        if (isNaN(timestamp.getTime())) {
            throw new Error('Invalid date format. Please use YYYY-MM-DD format.');
        }
        return this.getHistoricalStockInfo(acronym, timestamp);
    }

    /**
     * Fetches stock information for a relative time in the past.
     * @param {string} acronym - The stock ticker symbol (e.g., "AAPL").
     * @param {number} days - Number of days in the past.
     * @returns {Promise<StockInfo>} A promise that resolves to a StockInfo object.
     */
    async getStockInfoDaysAgo(acronym, days) {
        if (typeof days !== 'number' || days <= 0) {
            throw new Error('Days must be a positive number');
        }
        const timestamp = new Date();
        timestamp.setDate(timestamp.getDate() - days);
        return this.getHistoricalStockInfo(acronym, timestamp);
    }

    /**
     * Fetches stock information for a specific month and year.
     * @param {string} acronym - The stock ticker symbol (e.g., "AAPL").
     * @param {number} year - The year.
     * @param {number} month - The month (1-12).
     * @returns {Promise<StockInfo>} A promise that resolves to a StockInfo object.
     */
    async getStockInfoForMonth(acronym, year, month) {
        if (month < 1 || month > 12) {
            throw new Error('Month must be between 1 and 12');
        }
        const startDate = new Date(year, month - 1, 1);
        return this.getHistoricalStockInfo(acronym, startDate);
    }

    /**
     * Fetches intraday stock data for the last 24 hours at specified intervals.
     * @param {string} acronym - The stock ticker symbol (e.g., "AAPL").
     * @param {string} companyfullname - The full name of the company.
     * @param {string} currency - The currency of the stock price.
     * @param {string} [interval='30m'] - The interval between data points (e.g., '30m' for 30 minutes).
     * @returns {Promise<StockInfoSeries>} A promise that resolves to a StockInfoSeries object.
     * @throws {Error} If no data is available or the request fails.
     */
    async getIntradayStockInfoSeries(acronym, companyfullname, currency, interval = '30m') {
        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago
        
        const chartData = await yahooFinance.chart(acronym, {
            period1: Math.floor(startDate.getTime() / 1000),
            period2: Math.floor(endDate.getTime() / 1000),
            interval: interval
        });
        
        if (!chartData || !chartData.quotes || chartData.quotes.length === 0) {
            throw new Error(`No intraday data available for ${acronym}`);
        }
        
        const stockInfoSeries = new StockInfoSeries(startDate, endDate);
        
        for (const quote of chartData.quotes) {
            const stockInfo = new StockInfo(
                acronym,
                companyfullname,
                quote.close,
                currency,
                new Date(quote.date)
            );
            stockInfoSeries.addStock(stockInfo);
        }
        
        return stockInfoSeries;
    }
}

class StockInfoSeries {
    /**
     * Creates an instance of StockInfoSeries to hold StockInfo objects over a time period.
     * @param {Date} startPeriod - The start date of the series.
     * @param {Date} endPeriod - The end date of the series.
     */
    constructor(startPeriod, endPeriod) {
        if (!(startPeriod instanceof Date) || !(endPeriod instanceof Date)) {
            throw new Error('startPeriod and endPeriod must be Date objects');
        }

        if (startPeriod >= endPeriod) {
            throw new Error('startPeriod must be earlier than endPeriod');
        }

        this.startPeriod = startPeriod;
        this.endPeriod = endPeriod;
        this.stocks = [];
    }

    /**
     * Adds a StockInfo object to the series.
     * @param {StockInfo} stockInfo - The StockInfo object to add.
     * @throws {Error} If the stockInfo is not valid or outside the time period.
     */
    addStock(stockInfo) {
        if (!(stockInfo instanceof StockInfo)) {
            throw new Error('stockInfo must be a StockInfo object');
        }

        if (stockInfo.timestamp < this.startPeriod || stockInfo.timestamp > this.endPeriod) {
            throw new Error('StockInfo timestamp is outside the defined time period');
        }

        this.stocks.push(stockInfo);
        // Sort by timestamp to maintain chronological order
        this.stocks.sort((a, b) => a.timestamp - b.timestamp);
    }

    /**
     * Bulk adds multiple StockInfo objects to the series.
     * @param {Array<StockInfo>} stockInfoArray - Array of StockInfo objects.
     */
    addStocks(stockInfoArray) {
        if (!Array.isArray(stockInfoArray)) {
            throw new Error('stockInfoArray must be an array');
        }

        for (const stockInfo of stockInfoArray) {
            this.addStock(stockInfo);
        }
    }

    /**
     * Gets all StockInfo objects in the series.
     * @returns {Array<StockInfo>} Array of StockInfo objects.
     */
    getAllStocks() {
        return [...this.stocks];
    }

    /**
     * Gets StockInfo objects within a specific time range.
     * @param {Date} from - Start date.
     * @param {Date} to - End date.
     * @returns {Array<StockInfo>} Array of StockInfo objects within the range.
     */
    getStocksInRange(from, to) {
        return this.stocks.filter(stock =>
            stock.timestamp >= from && stock.timestamp <= to
        );
    }

    /**
     * Gets the latest StockInfo object in the series.
     * @returns {StockInfo|null} The latest StockInfo object or null if empty.
     */
    getLatestStock() {
        if (this.stocks.length === 0) return null;
        return this.stocks[this.stocks.length - 1];
    }

    /**
     * Gets the earliest StockInfo object in the series.
     * @returns {StockInfo|null} The earliest StockInfo object or null if empty.
     */
    getEarliestStock() {
        if (this.stocks.length === 0) return null;
        return this.stocks[0];
    }

    /**
     * Calculates price change over the entire period.
     * @returns {number|null} Price change as a percentage or null if insufficient data.
     */
    calculatePriceChange() {
        const earliest = this.getEarliestStock();
        const latest = this.getLatestStock();

        if (!earliest || !latest) return null;

        return ((latest.price - earliest.price) / earliest.price) * 100;
    }

    /**
     * Calculates the average price over the period.
     * @returns {number|null} Average price or null if the series is empty.
     */
    calculateAveragePrice() {
        if (this.stocks.length === 0) return null;

        const sum = this.stocks.reduce((total, stock) => total + stock.price, 0);
        return sum / this.stocks.length;
    }

    /**
     * Returns a JSON representation of the StockInfoSeries.
     * @returns {object} A JSON representation of the series.
     */
    toJSON() {
        return {
            startPeriod: this.startPeriod.toISOString(),
            endPeriod: this.endPeriod.toISOString(),
            stocks: this.stocks.map(stock => stock.toJSON())
        };
    }
}

module.exports = {
    StockInfo,
    StockInfoFetcher,
    StockInfoSeries,
};