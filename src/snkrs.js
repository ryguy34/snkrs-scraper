const axios = require("axios");
const cheerio = require("cheerio");
const SnkrsDropInfo = require("./vo/snkrsDropInfo");
const constants = require("./constants");
const Utility = require("./utility");
const zlib = require("zlib");

class SNKRS {
	constructor() {}

	async parseSnkrsDropInfo(tomorrowsDate) {
		var itemsReleasing = [];
		const options = {
			method: "get",
			url: constants.SNKRS.URL,
			headers: constants.SNKRS.HEADERS,
			responseType: "arraybuffer",
			transformResponse: [
				(data) => {
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
			const $ = cheerio.load(res.data);

			const rootElement = $("#root");
			console.log(rootElement.html());

			// $(".product-card").each((_, ele) => {
			// 	//var link = $(ele).find("a").attr("href");
			// 	console.log(ele);
			// });
		} catch (error) {
			console.error("Error parsing SNKRS release: " + error);
		}

		return itemsReleasing;
	}
}

module.exports = SNKRS;
