import {
	Client,
	ChannelType,
	EmbedBuilder,
	TextChannel,
	GuildBasedChannel,
} from "discord.js";
import "dotenv/config";
import fs from "fs";
import { ShopifyChannelInfo } from "./vo/shopify/shopifyChannelInfo";
import { SnkrsDropInfo } from "./vo/snkrs/snkrsDropInfo";
import logger from "./config/logger";

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
	async sendDropInfo(
		textChannelInfo: ShopifyChannelInfo,
		channel: TextChannel,
		siteName: string
	) {
		let channelMessage = "";
		if (siteName === "Supreme") {
			channelMessage = textChannelInfo.openingMessage.replace(
				"Supreme",
				"<@&834439456421314560>"
			);
		} else if (siteName === "Palace") {
			channelMessage =
				textChannelInfo.openingMessage + " <@&834439872499417088>";
		} else {
			logger.error("Uncaught site name");
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
	 * makes a list of embeds for the upcoming products
	 *
	 * @param {*} textChannelInfo
	 * @param {*} channel
	 * @param {*} siteName
	 * @returns
	 */
	async sendSnkrsDropInfo(
		snkrsChannelInfo: SnkrsDropInfo,
		channel: TextChannel
	) {
		channel.send("<@&834440275908755566>");
		var embed;
		embed = new EmbedBuilder()
			.setColor(0xcc0000)
			.setTitle(snkrsChannelInfo.title)
			.setURL(snkrsChannelInfo.link)
			.setDescription(snkrsChannelInfo.description)
			.setThumbnail("attachment://logo.png")
			.addFields(
				{ name: "Price", value: snkrsChannelInfo.price },
				{ name: "Date", value: snkrsChannelInfo.releaseDate },
				{ name: "Time", value: snkrsChannelInfo.releaseTime }
			)
			.setTimestamp()
			.setFooter({
				text: `Good luck on the upcoming SNKRS drops!!!`,
				iconURL: "attachment://logo.png",
			});

		var embeds = [];
		embeds.push(embed);
		for (const image of snkrsChannelInfo.imageUrls) {
			var imageEmbed = new EmbedBuilder()
				.setURL(snkrsChannelInfo.link)
				.setImage(image);

			embeds.push(imageEmbed);
		}

		const image = fs.readFileSync("./resources/logo.png");

		await channel.send({
			embeds: embeds,
			files: [{ attachment: image, name: "logo.png" }],
		});
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
		category: GuildBasedChannel,
		channelName: string
	) {
		const guild = client.guilds.cache.get(process.env.SERVER_ID!);

		if (!guild) {
			logger.error(`Guild not found.`);
			return;
		}

		//Create a new text channel in the specified category
		const newChannel = await guild.channels.create({
			name: channelName,
			type: ChannelType.GuildText,
			parent: category.id,
			reason: `Creating a new weekly release ${channelName} under ${category.name}`,
		});

		logger.info(
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
		logger.info(`Searching for channel: ${channelName}`);

		return new Promise((resolve) => {
			const guild = client.guilds.cache.get(process.env.SERVER_ID!);

			const channelExists = guild?.channels.cache.some((channel) => {
				return (
					channel.name === channelName && channel.parentId === categoryId
				);
			});

			if (channelExists) {
				logger.warn(
					`Channel ${channelName} exists under categoryId ${categoryId}`
				);
			} else {
				logger.info(
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
		const guild = client.guilds.cache.get(process.env.SERVER_ID!);

		const category = guild?.channels.cache.find(
			(channel) =>
				channel.type === 4 && channel.name.includes(partialCategoryName)
		);

		if (category) {
			logger.info(`Category name ${category.name}`);
		} else {
			logger.error(`Category name not found for ${partialCategoryName}`);
			return;
		}

		return category;
	}

	async cleanUpOldReleasesByMonthAndDay(
		client: Client,
		dateToday: Date,
		categoryId: string
	) {
		const guild = client.guilds.cache.get(process.env.SERVER_ID!);
		const monthDayToday = dateToday.getMonth() * 100 + dateToday.getDate();

		const releaseList = guild!.channels.cache.filter((channel) => {
			return channel.parentId === categoryId;
		});

		const oldReleasesList = releaseList.filter((channel) => {
			const channelDateList = channel.name.split("-");
			const channelDate = new Date(
				`${dateToday.getFullYear()}-${channelDateList[0]}-${
					channelDateList[1]
				}`
			);
			const monthDayChannelDay =
				(channelDate.getMonth() + 1) * 100 + channelDate.getDate();

			return monthDayToday > monthDayChannelDay;
		});

		oldReleasesList.map(async (oldChannel) => {
			try {
				const channelToRemove = await guild!.channels.fetch(oldChannel.id);
				if (channelToRemove) {
					await channelToRemove.delete();
					console.log(
						`Channel ${channelToRemove.name} has been successfully removed.`
					);
				} else {
					console.log(`Channel with ID ${oldChannel.id} not found.`);
				}
			} catch (error) {
				console.error("Error deleting channel(s):", error);
			}
		});

		console.log("Done deleting old releases");
	}
}
