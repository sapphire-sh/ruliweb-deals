import { sleep } from '@sapphire-sh/utils';
import schedule from 'node-schedule';
import { Database, Parser, Tweeter } from '~/libs';
import { Item } from './models';

export class App {
	private readonly database: Database;
	private readonly parser: Parser;
	private readonly tweeter: Tweeter;

	public constructor() {
		this.database = new Database();
		this.parser = new Parser();
		this.tweeter = new Tweeter(__config);
	}

	private async parse(): Promise<Item[]> {
		return await this.parser.parse();
	}

	private async tweet(item: Item): Promise<void> {
		try {
			if (item.id <= this.database.lastId) {
				return;
			}

			await this.tweeter.tweetItem(item);
			item.tweet = 1;
			this.database.update(item);
			await sleep(1000);
		} catch (error) {
			console.log(error);
		}
	}

	private async process() {
		const date = new Date();
		console.log('parse', date);

		const items = await this.parse();
		for (const item of items) {
			await this.tweet(item);
		}
	}

	public async start() {
		schedule.scheduleJob('*/2 * * * *', () => this.process());
	}
}
