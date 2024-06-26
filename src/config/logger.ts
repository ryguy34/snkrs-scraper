// logger.ts
import winston from "winston";

// Define your custom logger configuration
const logger = winston.createLogger({
	level: "info", // Set the default log level
	format: winston.format.combine(
		winston.format.timestamp(), // Add timestamp
		winston.format.json() // JSON format
	),
	transports: [
		new winston.transports.Console(), // Console transport
	],
});

export default logger;
