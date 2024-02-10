const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios')
const { omdb } = require('../../config.json')

const contentSearch = async (key, options) => {
  let endpoint = `https://www.omdbapi.com/?apikey=${key}&s=${encodeURI(options.query)}`
	try {
  	let response = await axios.get(endpoint)
		let dataset = (response.data.Search.map(result => { return result.Type === 'series' ? result : '' }))[0]
		let domains = ['vidsrc.in', 'vidsrc.pm', 'vidsrc.xyz', 'vidsrc.net']
		series.urls = domains.map(domain => {
			return `https://${domain}/embed/tv?imdb=${series.imdbID}&season=${options.season}&episode=${options.episode}`
		})
		return dataset
	} catch (error) {
		return error
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tv')
		.setDescription('watch tv content from the internet')
		.addStringOption(
			option => option.setName('query')
				.setDescription('Title of content')
				.setRequired(true)
		)
		.addIntegerOption(
			option => option.setName('season')
				.setDescription('Season number')
				.setRequired(true)
		)
		.addIntegerOption(
			option => option.setName('episode')
				.setDescription('Episode number')
				.setRequired(true)
		),
		async execute(interaction) {
			try {
				const options = {
					query: interaction.options.getString('query'),
					season: interaction.options.getInteger('season'),
					episode: interaction.options.getInteger('episode')
				}
				const results = await contentSearch(omdb.key, options)
				/*
				const streamLink1 = new ButtonBuilder().setLabel('Stream 1').setURL(results.urls[0]).setStyle(ButtonStyle.Link)
				const streamLink2 = new ButtonBuilder().setLabel('Stream 2').setURL(results.urls[1]).setStyle(ButtonStyle.Link)
				const streamLink3 = new ButtonBuilder().setLabel('Stream 3').setURL(results.urls[2]).setStyle(ButtonStyle.Link)
				const streamLink4 = new ButtonBuilder().setLabel('Stream 4').setURL(results.urls[3]).setStyle(ButtonStyle.Link)
				*/
				const row = new ActionRowBuilder()
				
				// .addComponents(streamLink1).addComponents(streamLink2).addComponents(streamLink3).addComponents(streamLink4)

				row.addComponents(new ButtonBuilder().setLabel('Stream 1').setURL(results.urls[0]).setStyle(ButtonStyle.Link))

				// const embed = new EmbedBuilder().addFields()
				await interaction.reply({
					content: `${results.Title} - S${options.season}:E${options.episode}`,
					components: [row],
					ephemeral: true
				})
			}
			catch (error) {
				console.error(error)
				await interaction.reply({
					content: `Sorry nothing found for "${options.query}". Please try something else.`,
					ephemeral: true
				})
			}
	},
};
