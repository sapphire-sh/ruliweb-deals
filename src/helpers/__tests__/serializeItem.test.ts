import {
	Item,
} from '~/models';

import {
	serializeItem,
	deserializeItem,
} from '../serializeItem';

describe('helpers/serializeItem', () => {
	const prevItem: Item = {
		id: 10,
		link: '',
		title: '',
		tweet: 0,
		type: '',
	};

	test('success', () => {
		const value = serializeItem(prevItem);
		const nextItem = deserializeItem(value);

		expect(nextItem).toEqual(prevItem);
	});
});
