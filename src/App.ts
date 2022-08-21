import IORedis from 'ioredis';
import schedule from 'node-schedule';
import { sleep } from '~/helpers';
import { Database, Parser, Tweeter } from '~/libs';

export class App {
	private readonly database: Database;
	private readonly parser: Parser;
	private readonly tweeter: Tweeter;

	public constructor() {
		const redis = new IORedis();

		this.database = new Database(redis);
		this.parser = new Parser();
		this.tweeter = new Tweeter(__config);
	}

	private async parse(): Promise<void> {
		const items = await this.parser.parse();
		for (const item of items) {
			await this.database.insertItem(item);
		}
	}

	private async tweet(): Promise<void> {
		const items = await this.database.getUntweetedItems();
		for (const item of items) {
			try {
				await this.tweeter.tweetItem(item);
				item.tweet = 1;
				await this.database.updateItem(item);
				await sleep(1000);
			} catch (error) {
				console.log(error);
			}
		}
	}

	public async start() {
		schedule.scheduleJob('*/2 * * * *', async () => {
			const date = new Date();
			console.log('parse', date);

			await this.parse();
			await this.tweet();
		});
	}
}
