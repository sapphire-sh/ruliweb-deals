import Twit from 'twit';
import { composeTweet } from '~/helpers';
import { Item } from '~/models';

export class Tweeter {
	private readonly twit: Twit;

	public constructor(config: Twit.ConfigKeys) {
		this.twit = new Twit(config);
	}

	protected async tweet(status: string): Promise<void> {
		await this.twit.post('statuses/update', { status });
	}

	private shouldTweet(text: string): boolean {
		const words = ['covid', '코로나'];
		const x = text.toLowerCase();
		for (const word of words) {
			if (x.indexOf(word) !== -1) {
				return false;
			}
		}
		return true;
	}

	public async tweetItem(item: Item): Promise<void> {
		if (this.shouldTweet(item.title) === false) {
			return;
		}
		const status = composeTweet(item);
		await this.tweet(status);
	}
}
