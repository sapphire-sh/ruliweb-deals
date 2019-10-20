import _ from 'lodash';

import faker from 'faker';

import {
	Item,
} from '~/models';

import {
	Database,
} from '../Database';

describe('libs/Database', () => {
	function getRandomItem(): Item {
		return {
			id: faker.random.number(),
			type: faker.random.alphaNumeric(8),
			title: faker.random.alphaNumeric(8),
			link: faker.random.alphaNumeric(8),
			tweet: 0,
		};
	}

	const prevItem = getRandomItem();

	const database = new Database();

	beforeEach(async () => {
		await database.flush();
		await database.insertItem(prevItem);
	});

	describe('getItem', () => {
		test('success', async () => {
			const item = await database.getItem(prevItem.id);
			expect(item).not.toBeNull();
		});

		test('failure - not found', async () => {
			const id = faker.random.number();
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
			const item = _.cloneDeep(prevItem);
			item.tweet = 1;

			const res = await database.updateItem(item);
			expect(res).toBe(true);

			const items = await database.getUntweetedItems();
			expect(items).toHaveLength(0);
		});
	});

	describe('insertItem', () => {
		test('success', async () => {
			const item = getRandomItem();

			const res = await database.insertItem(item);
			expect(res).toBe(true);

			const nextItem = await database.getItem(item.id);
			expect(nextItem).toEqual(item);
		});

		test('failure - duplicate', async () => {
			const item = _.cloneDeep(prevItem);

			const res = await database.insertItem(item);
			expect(res).toBe(false);

			const nextItem = await database.getItem(item.id);
			expect(nextItem).toEqual(prevItem);
		});
	});

	describe('updateItem', () => {
		test('success', async () => {
			const item = _.cloneDeep(prevItem);
			item.tweet = 1;

			const res = await database.updateItem(item);
			expect(res).toBe(true);

			const nextItem = await database.getItem(prevItem.id);
			expect(nextItem).not.toBeNull();
			expect(nextItem!.tweet).toBe(1);
		});

		test('failure', async () => {
			const item = _.cloneDeep(prevItem);
			item.tweet = 1;

			{
				const res = await database.updateItem(item);
				expect(res).toBe(true);
			}

			item.tweet = 0;
			const res = await database.updateItem(item);
			expect(res).toBe(false);

			const nextItem = await database.getItem(prevItem.id);
			expect(nextItem).not.toBeNull();
			expect(nextItem!.tweet).toBe(1);
		});
	});

	describe('getLastID', () => {
		test('success', async () => {
			const id = await database.getLastID();
			expect(id).toBe(prevItem.id);
		});

		test('success - default id', async () => {
			await database.flush();

			const id = await database.getLastID();
			expect(id).toBe(database.defaultID);
		});
	});
});
