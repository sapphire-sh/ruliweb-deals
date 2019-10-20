import {
	Database,
	Parser,
	Tweeter,
} from '~/libs';

import {
	Item,
} from '~/models';

import {
	sleep,
} from '~/helpers';

export class App {
	private readonly database: Database;
	private readonly tweeter: Tweeter;

	public constructor() {
		this.database = new Database();
		this.tweeter = new Tweeter(__config);
	}

	public async initialize() {
		Parser.createInstance();
	}

	public async start() {
		const parser = Parser.getInstance();

		if (__test === false) {
			try {
				const lastID = await this.database.getLastID();

				let items: Item[] = [];
				let page = 0;
				do {
					items = await parser.parse(lastID, page);
					for (const item of items) {
						await this.database.insertItem(item);
					}

					console.log(items.length);

					page++;
				}
				while (items.length > 0);
			}
			catch (err) {
				console.trace(err);
			}
		}

		if (__test === false) {
			try {
				const items = await this.database.getUntweetedItems();

				console.log(items);

				for (const item of items) {
					await this.tweeter.tweetItem(item);
					await sleep(5000);
				}
			}
			catch (err) {
				console.trace(err);
			}
		}
	}
}
