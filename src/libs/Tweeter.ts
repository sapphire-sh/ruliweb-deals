import {
	Item,
} from '../models';

import Twit from 'twit';

export class Tweeter {
	private static instance: Tweeter | null = null;

	private twit: Twit;

	private constructor(config: Twit.ConfigKeys) {
		this.twit = new Twit(config);
	}

	public static createInstance(config: Twit.ConfigKeys) {
		if(this.instance !== null) {
			return;
		}
		this.instance = new Tweeter(config);
	}

	public static getInstance(): Tweeter {
		if(this.instance === null) {
			throw new Error('tweeter instance is not created');
		}
		return this.instance;
	}

	private async sendTweet(status: string) {
		return new Promise((resolve, reject) => {
			this.twit.post('statuses/update', {
				'status': status,
			}, (err, _) => {
				if(err) {
					return reject(err);
				}
				resolve();
			});
		});
	}

	public async tweet(item: Item) {
		try {
			const {
				id,
				title,
				type,
				link,
			} = item;

			if(title !== '') {
				const status = [
					`[${type}]`,
					title.substr(0, 140),
					link,
				].join('\n');

				await this.sendTweet(status);
			}

			// const database = Database.getInstance();
			// await database.update(id);
		}
		catch(err) {
			console.trace(err);
		}
	}
}
