import {
	Database,
	Parser,
	Tweeter,
} from '~/libs';

import {
	sleep,
} from '~/helpers';

export class App {
	private readonly database: Database;
	private readonly parser: Parser;
	private readonly tweeter: Tweeter;

	public constructor() {
		this.database = new Database();
		this.parser = new Parser();
		this.tweeter = new Tweeter(__config);
	}

	public async start() {
		if (__test === false) {
			try {
				const lastID = await this.database.getLastID();

				const items = await this.parser.parse();
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
