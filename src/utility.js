class Utility {
	constructor() {}

	static getDate() {
		return new Date().toISOString().slice(0, 10);
	}

	static getFullYear() {
		return new Date().getFullYear();
	}

	static getCurrentSeason() {
		const todaysDate = new Date();
		const currentYear = todaysDate.getFullYear();
		if (todaysDate >= new Date().setFullYear(currentYear, 7, 1)) {
			return "fall-winter";
		} else {
			return "spring-summer";
		}
	}

	static getThursdayOfCurrentWeek() {
		const today = new Date();
		const currentDayOfWeek = today.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
		const daysUntilThursday = (4 - currentDayOfWeek + 7) % 7; // Calculate how many days to Thursday

		// Set the date to Thursday of the current week
		today.setDate(today.getDate() + daysUntilThursday);

		// Format the date as YYYY-MM-DD
		const year = today.getFullYear();
		const month = String(today.getMonth() + 1).padStart(2, "0");
		const day = String(today.getDate()).padStart(2, "0");

		return `${year}-${month}-${day}`;
	}

	static getFridayOfCurrentWeek() {
		const today = new Date();
		const currentDayOfWeek = today.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
		const daysUntilFriday = (5 - currentDayOfWeek + 7) % 7; // Calculate how many days to Friday

		// Set the date to Thursday of the current week
		today.setDate(today.getDate() + daysUntilFriday);

		// Format the date as YYYY-MM-DD
		const year = today.getFullYear();
		const month = String(today.getMonth() + 1).padStart(2, "0");
		const day = String(today.getDate()).padStart(2, "0");

		return `${year}-${month}-${day}`;
	}

	/**
	 * Returns string type of numbered version of month passed in
	 *
	 * @param {string} month
	 * @returns
	 */
	static convertMonthToNumber(month) {
		switch (month) {
			case "Jan":
				return "01";
			case "Feb":
				return "02";
			case "Mar":
				return "03";
			case "Apr":
				return "04";
			case "May":
				return "05";
			case "Jun":
				return "06";
			case "Jul":
				return "07";
			case "Aug":
				return "08";
			case "Sep":
				return "09";
			case "Oct":
				return "10";
			case "Nov":
				return "11";
			case "Dec":
				return "12";
		}
	}

	/**
	 * Returns tomorrows date in MM-DD format
	 *
	 * @returns
	 */
	static getTomorrowsDate() {
		const currentDate = new Date();

		// Calculate tomorrow's date
		const tomorrowDate = new Date(currentDate);
		tomorrowDate.setDate(currentDate.getDate() + 1);

		// Get the day and month components of tomorrow's date
		const day = tomorrowDate.getDate().toString().padStart(2, "0");
		const month = (tomorrowDate.getMonth() + 1).toString().padStart(2, "0");

		return `${month}-${day}`;
	}
}

module.exports = Utility;
