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
			url: "https://nike.com/launch?s=upcoming",
			headers: {
				Accept:
					"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
				"Accept-Language": "en-US,en;q=0.5",
				"Accept-Encoding": "gzip, deflate, br",
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36",
			},
			responseType: "arraybuffer",
			transformResponse: [
				(data) => {
					if (data.slice(0, 2).toString("hex") === "1f8b") {
						// Check if data is gzip-encoded
						return zlib.gunzipSync(data).toString("utf8");
					}
					return data.toString("utf-8"); // Assume it's utf8-encoded otherwise
				},
			],
		};

		try {
			const res = await axios(options);
			const $ = cheerio.load(res.data);

			//const bodyContent = $("body").html();
			const root = $.root();
			console.log(root);

			// $(".product-card").each((_, ele) => {
			// 	//var link = $(ele).find("a").attr("href");
			// 	console.log(ele);
			// });
		} catch (error) {
			console.error(error);
		}

		return itemsReleasing;
	}
}

module.exports = SNKRS;
