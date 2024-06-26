import { Channel, Client, ChannelType, EmbedBuilder } from "discord.js";
import "dotenv/config";
import "fs";

export class Discord {
	constructor() {}

	/**
	 * makes a list of embeds for the upcoming products
	 *
	 * @param {*} textChannelInfo
	 * @param {*} channel
	 * @param {*} siteName
	 * @returns
	 */
	async sendDropInfo(textChannelInfo, channel: Channel, siteName: string) {
		let channelMessage = "";
		if (siteName === "Supreme") {
			channelMessage = textChannelInfo.openingMessage.replace(
				"Supreme",
				"<@&834439456421314560>"
			);
		} else if (siteName === "Palace") {
			channelMessage =
				textChannelInfo.openingMessage + " <@&834439872499417088>";
		}

		channel.send(channelMessage);

		for (const product of textChannelInfo.products) {
			const embed = new EmbedBuilder()
				.setColor(0x0099ff)
				.setTitle(product.productName)
				.setURL(product.productInfoUrl)
				.setThumbnail("attachment://logo.png")
				.addFields(
					{ name: "Price", value: product.price },
					{
						name: " ",
						value: `[${siteName} Category](${product.categoryUrl})`,
					}
				)
				.setImage(product.imageUrl)
				.setTimestamp()
				.setFooter({
					text: `Good luck on ${textChannelInfo.channelName}'s drops!!!`,
					iconURL: "attachment://logo.png",
				});

			const image = fs.readFileSync("./resources/logo.png");

			await channel.send({
				embeds: [embed],
				files: [{ attachment: image, name: "logo.png" }],
			});
		}
	}

	/**
	 * creates a new channel given the category and channel name
	 *
	 * @param {*} client
	 * @param {*} categoryName
	 * @param {*} channelName
	 * @returns
	 */
	async createTextChannel(
		client: Client,
		category: string,
		channelName: string
	) {
		const guild = client.guilds.cache.get(process.env.SERVER_ID);

		if (!guild) {
			return console.log(`Guild not found.`);
		}

		//Create a new text channel in the specified category
		const newChannel = await guild.channels.create({
			name: channelName,
			type: ChannelType.GuildText,
			parent: category.id,
			reason: `Creating a new weekly release ${channelName} under ${category.name}`,
		});

		console.log(
			`Channel "${newChannel.name}" created in category "${category.name}".`
		);

		return newChannel;
	}

	/**
	 * returns a boolean of whether or not the channel exists under the given category
	 *
	 * @param {*} client
	 * @param {*} name
	 * @returns
	 */
	async doesChannelExistUnderCategory(
		client: Client,
		channelName: string,
		categoryId: string
	) {
		console.log(`Searching for channel: ${channelName}`);

		return new Promise((resolve) => {
			const guild = client.guilds.cache.get(process.env.SERVER_ID);

			const channelExists = guild.channels.cache.some((channel) => {
				return (
					channel.name === channelName && channel.parentId === categoryId
				);
			});

			if (channelExists) {
				console.log(
					`Channel ${channelName} exists under categoryId ${categoryId}`
				);
			} else {
				console.log(
					`Channel ${channelName} doesn't exist under categoryId ${categoryId}`
				);
			}

			resolve(channelExists);
		});
	}

	/**
	 * returns full category by its substring
	 *
	 * @param {*} client
	 * @param {*} partialCategoryName
	 * @returns
	 */
	async getFullCategoryNameBySubstring(
		client: Client,
		partialCategoryName: string
	) {
		const guild = client.guilds.cache.get(process.env.SERVER_ID);

		const category = guild.channels.cache.find(
			(channel) =>
				channel.type === 4 && channel.name.includes(partialCategoryName)
		);

		if (category) {
			console.log(`Category name ${category.name}`);
		} else {
			console.log(`Category name not found for ${partialCategoryName}`);
			return;
		}

		return category;
	}
}
