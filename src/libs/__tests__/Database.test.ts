import { faker } from '@faker-js/faker';
import IORedis from 'ioredis-mock';
import { Item } from '~/models';
import { Database } from '../Database';

const getRandomItem = (defaultId: number): Item => {
	return {
		id: faker.datatype.number() + defaultId + 1,
		type: faker.random.alphaNumeric(8),
		title: faker.random.alphaNumeric(8),
		link: faker.random.alphaNumeric(8),
		tweet: 0,
	};
};

describe('libs/Database', () => {
	let database: Database;
	let prevItem: Item;

	beforeAll(() => {
		const redis = new IORedis();
		database = new Database(redis);
	});

	beforeEach(async () => {
		prevItem = getRandomItem(database.defaultId);

		await database.flush();
		await database.insertItem(prevItem);
	});

	describe('getItem', () => {
		test('success', async () => {
			const item = await database.getItem(prevItem.id);
			expect(item).not.toBeNull();
		});

		test('failure - not found', async () => {
			const id = faker.datatype.number();
			const item = await database.getItem(id);
			expect(item).toBeNull();
		});
	});

	describe('getItems', () => {
		test('success', async () => {
			const items = await database.getItems();
			expect(items).toHaveLength(1);
			expect(items).toContainEqual(prevItem);
		});
	});

	describe('getUntweetedItems', () => {
		test('success', async () => {
			const items = await database.getUntweetedItems();
			expect(items).toHaveLength(1);
			expect(items[0]).toEqual(prevItem);
		});

		test('success - no items', async () => {
			prevItem.tweet = 1;

			const res = await database.updateItem(prevItem);
			expect(res).toBe(true);

			const items = await database.getUntweetedItems();
			expect(items).toHaveLength(0);
		});
	});

	describe('insertItem', () => {
		test('success', async () => {
			const item = getRandomItem(database.defaultId);

			const res = await database.insertItem(item);
			expect(res).toBe(true);

			const nextItem = await database.getItem(item.id);
			expect(nextItem).toEqual(item);
		});

		test('failure - duplicate', async () => {
			const res = await database.insertItem(prevItem);
			expect(res).toBe(false);

			const nextItem = await database.getItem(prevItem.id);
			expect(nextItem).toEqual(prevItem);
		});
	});

	describe('updateItem', () => {
		test('success', async () => {
			prevItem.tweet = 1;

			const res = await database.updateItem(prevItem);
			expect(res).toBe(true);

			const nextItem = await database.getItem(prevItem.id);
			expect(nextItem).not.toBeNull();
			expect(nextItem!.tweet).toBe(1);
		});

		test('failure', async () => {
			prevItem.tweet = 1;

			{
				const res = await database.updateItem(prevItem);
				expect(res).toBe(true);
			}

			prevItem.tweet = 0;
			const res = await database.updateItem(prevItem);
			expect(res).toBe(false);

			const nextItem = await database.getItem(prevItem.id);
			expect(nextItem).not.toBeNull();
			expect(nextItem!.tweet).toBe(1);
		});
	});

	describe('getLastID', () => {
		test('success', async () => {
			const id = await database.getLastId();
			expect(id).toBe(prevItem.id);
		});

		test('success - default id', async () => {
			await database.flush();

			const id = await database.getLastId();
			expect(id).toBe(database.defaultId);
		});
	});
});
