import { Item } from '~/models';
import { composeTweet } from '../composeTweet';

describe('helpers/composeTweet', () => {
	const item: Item = {
		id: 32576,
		type: 'A/V',
		title: '[A/V] [Drop] 젠하이저 HD6XX HEADPHONES ($195/미국FS)',
		link: 'https://bbs.ruliweb.com/news/board/1020/read/32576',
		tweet: 0,
	};

	test('success', () => {
		expect(composeTweet(item)).toBe(
			[
				'[A/V]',
				'[A/V] [Drop] 젠하이저 HD6XX HEADPHONES ($195/미국FS)',
				'https://bbs.ruliweb.com/news/board/1020/read/32576',
			].join('\n')
		);
	});
});
