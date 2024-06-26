export class PalaceTextChannelInfo {
	channelName: string;
	openingMessage: string;
	products: [];

	constructor(channelName: string, openingMessage: string) {
		this.channelName = channelName;
		this.openingMessage = openingMessage;
		this.products = [];
	}
}
