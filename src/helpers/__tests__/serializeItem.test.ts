import {
	Item,
} from '~/models';

import {
	serializeItem,
	deserializeItem,
} from '../serializeItem';

describe('helpers/serializeItem', () => {
	const prevItem: Item = {
		id: 32576,
		type: 'A/V',
		title: '[A/V] [Drop] 젠하이저 HD6XX HEADPHONES ($195/미국FS)',
		link: 'https://bbs.ruliweb.com/news/board/1020/read/32576',
		tweet: 0,
	};

	test('success', () => {
		const value = serializeItem(prevItem);
		const nextItem = deserializeItem(value);

		expect(nextItem).toEqual(prevItem);
	});
});
