const { SlashCommandBuilder } = require("discord.js");
const { StockInfo, StockInfoFetcher} = require("../../utils/stockModule");

module.exports = {
	economyBased: true,
	administratorOnly: false,
	data: new SlashCommandBuilder()
		.setName("getstockinfo")
		.setDescription(
			"Gets stock information for a user a given company"
		)
		.addStringOption((option) =>
			option
				.setName("symbol")
				.setDescription(
					"The symbol of the company to get stock information for"
				)
				.setRequired(true)
		),
	async execute(interaction, client) {
		const stockSymbol = interaction.options.getString("symbol");
        const stockInfoFetcherObject = new StockInfoFetcher()
        const stockInfo = await stockInfoFetcherObject.getStockInfo(stockSymbol)
        if (!stockInfo) {
            return interaction.reply({ content: `Could not find stock information for symbol ${stockSymbol}`, ephemeral: true });
        }

        const stockEmbed = {
            color: 0x0099ff, // Blue color
            title: `📊 Stock Info: ${stockInfo.companyfullname}`,
            description: `Information for symbol **${stockInfo.acronym}**`,
            fields: [
                {
                    name: '💰 Current Price',
                    value: `**${stockInfo.price} ${stockInfo.currency}**`,
                    inline: true
                },
                {
                    name: '🕒 Data Timestamp',
                    value: `${new Date(stockInfo.timestamp).toLocaleString()}`,
                    inline: true
                }
            ],
            footer: {
                text: `Stock data provided by the Yahoo Finance API`
            },
            timestamp: new Date()
        };

        await interaction.reply({ embeds: [stockEmbed] });
	},
};
