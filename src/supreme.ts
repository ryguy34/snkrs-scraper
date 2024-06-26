import "dotenv/config";
import axios from "axios";
import { load } from "cheerio";

const constants = require("./constants");
const SupremeDropInfo = require("./vo/SupremeDropInfo");
const TextChannelInfo = require("./vo/textChannelInfo");

export class Supreme {
	constructor() {}

	async parseSupremeDrop(
		currentWeekThursdayDate: string,
		currentYear: number,
		currentSeason: string
	) {
		var productList: (typeof SupremeDropInfo)[] = [];

		try {
			const res = await axios.get(
				constants.SUPREME_COMMUNITY_BASE_URL +
					"/season/" +
					currentSeason +
					currentYear +
					"/droplist/" +
					currentWeekThursdayDate,
				constants.params
			);

			const htmlData = res.data;
			const $ = load(htmlData);
			var title = $("title").text();
			var channelName = title
				.substring(title.indexOf("-") + 1, title.lastIndexOf("-"))
				.trim()
				.toLocaleLowerCase()
				.replace(" ", "-");

			var supremeTextChannelInfo = new TextChannelInfo(channelName, title);

			$(".catalog-item").each((_: number, ele: any) => {
				var productInfo = new SupremeDropInfo();
				var itemId = $(ele).find("a").attr("data-itemid");
				var itemSlug = $(ele).find("a").attr("data-itemslug");
				var itemName = $(ele).find("a").attr("data-itemname");
				var category = $(ele).attr("data-category");
				var png = $(ele).find("img").attr("src");

				const price = $(ele)
					.find(".catalog-label-price")
					.first()
					.text()
					.replace(/(\r\n|\n|\r)/gm, "");

				productInfo.imageUrl =
					constants.SUPREME_COMMUNITY_BASE_URL + "/resize/576" + png;
				productInfo.productName = itemName === "" ? "?" : itemName;
				productInfo.price = price === "" ? "Free or Unknown" : price;
				productInfo.categoryUrl =
					constants.SUPREME_BASE_URL + "collections/" + category;
				productInfo.productInfoUrl =
					constants.SUPREME_COMMUNITY_BASE_URL +
					"/season/itemdetails/" +
					itemId +
					"/" +
					itemSlug;

				productList.push(productInfo);
			});

			supremeTextChannelInfo.products = productList;
		} catch (error) {
			console.error(error);
		}

		return supremeTextChannelInfo;
	}
}
