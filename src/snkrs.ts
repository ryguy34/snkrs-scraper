const axios = require("axios");
import { load } from "cheerio";
import zlib from "zlib";
import logger from "./config/logger";
import puppeteer from "puppeteer";
const constants = require("./constants");

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
				// https://www.nike.com/launch/t/acg-rufus-sequoia
				const productLink = `${constants.SNKRS.BASE_URL}${link}`.split(
					"?"
				)[0];
				productLinks.push(productLink);
			});
		} catch (error) {
			logger.error("Error gathering SNKRS release links: " + error);
		}

		const browser = await puppeteer.launch();
		const page = await browser.newPage();

		for (const link of productLinks) {
			try {
				options.url = link;
				await page.goto(link);
				const dynamicContent = await page.content();
				const $ = load(dynamicContent);
				const model = $(".product-info").find("h1").first().text();
				const name = $(".product-info").find("h2").first().text();
				const price = $(".product-info").find("div").first().text();
				const availableAt = $(".product-info .test-available-date")
					.find("div")
					.text()
					.replace("2:00 PM", "9:00 AM")
					.replace("Available ", "");
				const dateTime = this.parseDateTime(availableAt);
				const releaseDate = dateTime[0];
				const releaseTime = dateTime[1];
				const descriptionAndSku = $(".product-info .description-text")
					.find("p")
					.first()
					.text()
					.split("\n");
				const description = descriptionAndSku[0];
				const sku = descriptionAndSku[1].trim().replace("SKU: ", "");

				const imageLinks = await page.evaluate(() => {
					const imgs = document.querySelectorAll("img");
					return Array.from(imgs).map((img) => img.src);
				});

				logger.info("link: " + link);
				logger.info("model: " + model);
				logger.info("name: " + name);
				logger.info("price: " + price);
				logger.info("releaseDate: " + releaseDate);
				logger.info("releaseTime: " + releaseTime);
				logger.info("description: " + description);
				logger.info("images: " + imageLinks);
				logger.info("sku: " + sku + "\n");
			} catch (error) {
				logger.error("Error parsing SNKRS release: " + error);
			}
		}

		return itemsReleasing;
	}

	parseDateTime(availableAt: string): string[] {
		// [date, time]
		return availableAt.split(" at ");
	}
}
