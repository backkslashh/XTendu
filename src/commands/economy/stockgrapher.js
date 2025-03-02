const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { StockInfoFetcher } = require('../../utils/stockModule');

module.exports = {
    economyBased: true,
    administratorOnly: false,
    data: new SlashCommandBuilder()
        .setName('stockgrapher')
        .setDescription('Gets stock information and a price variation graph for a given company')
        .addStringOption(option =>
            option.setName('symbol')
                .setDescription('The stock symbol (e.g., AAPL for Apple)')
                .setRequired(true)),
    async execute(interaction, client) {
        const stockSymbol = interaction.options.getString("symbol");
        const stockInfoFetcher = new StockInfoFetcher();

        try {
            const stockInfo = await stockInfoFetcher.getStockInfo(stockSymbol);
            if (!stockInfo) {
                return interaction.reply({ content: `Could not find stock info for ${stockSymbol}`, ephemeral: true });
            }

            const stockSeries = await stockInfoFetcher.getIntradayStockInfoSeries(stockSymbol, stockInfo.companyfullname, stockInfo.currency, '30m');
            const dataPoints = stockSeries.getAllStocks();

            if (dataPoints.length < 2) {
                return interaction.reply({ content: `Insufficient data for ${stockSymbol}`, ephemeral: true });
            }

            // Extract prices and extend the range
            const prices = dataPoints.map(dp => dp.price);
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            const extendedMin = Math.max(0, minPrice - 1);
            const extendedMax = maxPrice + 1;
            const numberOfLines = 10;
            const n = dataPoints.length;

            // Scale bars with extended range
            const hs = dataPoints.map(dp => {
                const scaled = (dp.price - extendedMin) / (extendedMax - extendedMin) * numberOfLines;
                return Math.ceil(scaled) || 1; // Ensure at least 1 for flat lines
            });

            // Set up labels
            const labelIndices = n >= 15 ? [0, Math.floor(n / 2), n - 1] : [0, n - 1];
            const labels = {};
            labels[0] = dataPoints[0].timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            if (n >= 15) {
                labels[Math.floor(n / 2)] = dataPoints[Math.floor(n / 2)].timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }
            labels[n - 1] = dataPoints[n - 1].timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            // Build the graph with extended range labels
            let graph = "Stock price variation over the last day. Each '█' represents a 30-min interval.\n";
            for (let i = numberOfLines - 1; i >= 0; i--) {
                let line = '';
                if (i === numberOfLines - 1) {
                    line += extendedMin.toFixed(2).padStart(8, ' ');
                } else if (i === 0) {
                    line += extendedMax.toFixed(2).padStart(8, ' ');
                } else {
                    line += ' '.repeat(8);
                }
                line += ' | ';
                for (const h of hs) {
                    line += i < numberOfLines - h ? ' ' : '█';
                }
                graph += line + '\n';
            }

            // Add x-axis
            graph += '--------|'.padStart(10, ' ') + '-'.repeat(n) + '\n';

            // Add label line
            let labelLine = ' '.repeat(10); // Align with y-axis
            let currentPos = 0;
            for (const pos of Object.keys(labels).map(Number).sort((a, b) => a - b)) {
                while (currentPos < pos) {
                    labelLine += ' ';
                    currentPos++;
                }
                labelLine += labels[pos];
                currentPos += labels[pos].length;
            }
            graph += labelLine;

            const stockEmbed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle(`📊 Stock Info: ${stockInfo.companyfullname}`)
                .setDescription(
                    `Information for symbol **${stockInfo.acronym}**\n\n` +
                    `📈 **Price Variation (Last Day)**\n` +
                    `\`\`\`text\n${graph}\n\`\`\``
                )
                .addFields(
                    { name: '💰 Current Price', value: `**${stockInfo.price} ${stockInfo.currency}**`, inline: true },
                    { name: '🕒 Data Timestamp', value: `${new Date(stockInfo.timestamp).toLocaleString()}`, inline: true }
                )
                .setFooter({ text: 'Stock data provided by Yahoo Finance API' })
                .setTimestamp();

            await interaction.reply({ embeds: [stockEmbed] });

        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Error fetching stock data.', ephemeral: true });
        }
    }
};