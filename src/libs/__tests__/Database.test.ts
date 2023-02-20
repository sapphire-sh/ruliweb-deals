import { faker } from '@faker-js/faker';
import { Item } from '~/models';
import { Database } from '../Database';

const getRandomItem = (defaultId?: number): Item => {
	return {
		id: faker.datatype.number() + (defaultId ?? 0) + 1,
		type: faker.random.alphaNumeric(8),
		title: faker.random.alphaNumeric(8),
		link: faker.random.alphaNumeric(8),
		tweet: 0,
	};
};

describe('libs/Database', () => {
	let database: Database;
	let prevItem: Item;

	beforeEach(async () => {
		database = new Database();
		prevItem = getRandomItem(database.lastId);
	});

	describe('update', () => {
		test('success', async () => {
			database.update(prevItem);
			expect(database.lastId).toBe(prevItem.id);
		});
	});
});
