import Twit from 'twit';

import {
	Item,
} from '~/models';

import {
	composeTweet,
} from '~/helpers';

export class Tweeter {
	private readonly twit: Twit;

	public constructor(config: Twit.ConfigKeys) {
		this.twit = new Twit(config);
	}

	protected async tweet(status: string): Promise<void> {
		await this.twit.post('statuses/update', { status });
	}

	public async tweetItem(item: Item): Promise<void> {
		try {
			const status = composeTweet(item);
			await this.tweet(status);
		}
		catch (error) {
			console.log(error);
		}
	}
}
