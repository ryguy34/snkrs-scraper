const axios = require("axios");
import { load } from "cheerio";
import zlib from "zlib";
import logger from "./config/logger";
const SnkrsDropInfo = require("./vo/snkrsDropInfo");
const constants = require("./constants");
const Utility = require("./utility");

export class SNKRS {
	constructor() {}

	async parseSnkrsDropInfo(tomorrowsDate: string) {
		var itemsReleasing: any[] = [];
		var productLinks: string[] = [];
		const options = {
			method: "get",
			url: constants.SNKRS.URL,
			headers: constants.SNKRS.HEADERS,
			responseType: "arraybuffer",
			transformResponse: [
				(data: any) => {
					if (data.slice(0, 2).toString("hex") === "1f8b") {
						// Check if data is gzip-encoded
						return zlib.gunzipSync(data).toString("utf8");
					}
					// Assume it's utf8-encoded otherwise
					return data.toString("utf-8");
				},
			],
		};

		try {
			const res = await axios(options);
			const $ = load(res.data);
			const rootElement = $("#root");

			$(".product-card").each((_: number, ele: any) => {
				var link = $(ele).find("a").attr("href");
				// TODO: need to make this logic better just incase there isa release after a event card
				if (link!.startsWith("/launch")) {
					// https://www.nike.com/launch/t/acg-rufus-sequoia
					const productLink = `${constants.SNKRS.BASE_URL}${link}`.split(
						"?"
					)[0];

					productLinks.push(productLink);
				}
			});
			//logger.info(JSON.stringify(productLinks));
		} catch (error) {
			logger.error("Error gathering SNKRS release links: " + error);
		}

		for (const link in productLinks) {
			try {
				logger.info(link);
				options.url = link;
				const res = await axios(options);
				const $ = load(res.data);

				var type = $(".product-info").find("h1").text();
				if (type) {
					logger.info(type);
				}
			} catch (error) {
				logger.error("Error parsing SNKRS release: " + error);
			}
		}

		return itemsReleasing;
	}
}
