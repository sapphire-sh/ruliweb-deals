import {
	Database,
	Parser,
	Tweeter,
} from './libs';

import {
	Item,
} from './models';

import {
	sleep,
} from './helpers';

export class App {
	public async initialize() {
		Database.createInstance(__config.knex);
		Parser.createInstance();
		Tweeter.createInstance(__config.twitter);

		const database = Database.getInstance();

		await database.initialize();
	}

	public async process() {
		const database = Database.getInstance();
		const parser = Parser.getInstance();
		const tweeter = Tweeter.getInstance();

		if(__test === false) {
			try {
				const lastID = await database.getLastID();

				let items: Item[] = [];
				let page = 0;
				do {
					items = await parser.parse(lastID, page);
					for(const item of items) {
						await database.insert(item);
					}

					console.log(items.length);

					page++;
				}
				while(items.length > 0);
			}
			catch(err) {
				console.trace(err);
			}
		}

		if(__test === false) {
			try {
				const items = await database.getUntweetedItems();

				console.log(items);

				for(const item of items) {
					await tweeter.tweet(item);
					await sleep(5000);
				}
			}
			catch(err) {
				console.trace(err);
			}
		}
	}
}
