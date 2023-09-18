const axios = require("axios");
const cheerio = require("cheerio");
const SnkrsDropInfo = require("./vo/snkrsDropInfo");
const constants = require("./constants");
const Utility = require("./utility");

class SNKRS {
	constructor() {}

	async parseSnkrsDropInfo() {
		var itemsReleasing = [];

		try {
			const response = await axios.get(
				constants.SNKRS_URL,
				constants.params
			);
			const $ = cheerio.load(response.data);

			return itemsReleasing;
		} catch (error) {
			console.log("Some error: " + error);
		}
	}
}

module.exports = SNKRS;
