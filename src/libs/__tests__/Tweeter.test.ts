import {
	Item,
} from '~/models';

import {
	composeTweet,
} from '~/helpers';

import {
	Tweeter,
} from '../Tweeter';

describe('libs/Tweeter', () => {
	class TestTweeter extends Tweeter {
		public status: string | null = null;

		public constructor() {
			super({
				consumer_key: 'consumer_key',
				consumer_secret: 'consumer_secret',
				access_token: 'access_token',
				access_token_secret: 'access_token_secret',
			});
		}

		protected async tweet(status: string): Promise<void> {
			this.status = status;
		}
	}

	const item: Item = {
		id: 32576,
		type: 'A/V',
		title: '[A/V] [Drop] 젠하이저 HD6XX HEADPHONES ($195/미국FS)',
		link: 'https://bbs.ruliweb.com/news/board/1020/read/32576',
		tweet: 0,
	};

	test('tweetItem', async () => {
		const tweeter = new TestTweeter();

		await tweeter.tweetItem(item);

		const status = composeTweet(item);

		expect(tweeter.status).toBe(status);
	});
});
