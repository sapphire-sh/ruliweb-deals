import _ from 'lodash';

import IORedis from 'ioredis';

import IORedisMock from 'ioredis-mock';

import {
	Item,
} from '~/models';

import {
	serializeItem,
	deserializeItem,
} from '~/helpers';

export class Database {
	private readonly redis: IORedis.Redis;

	public constructor() {
		this.redis = __test ? new IORedisMock() : new IORedis(process.env.REDIS_HOST);
	}

	public get key(): string {
		return 'ruliweb_deals';
	}

	public get defaultID(): number {
		return 41540;
	}

	public async flush(): Promise<void> {
		await this.redis.flushall();
	}

	public async getItem(id: number): Promise<Item | null> {
		const field = id.toString();
		const res = await this.redis.hget(this.key, field);

		if (res === null) {
			return null;
		}
		return deserializeItem(res);
	}

	public async getItems(): Promise<Item[]> {
		const res: { [key: string]: string; } = await this.redis.hgetall(this.key);

		const items = Object.values(res).map(x => deserializeItem(x));
		return items.filter((x): x is Item => x !== null);
	}

	public async getUntweetedItems(): Promise<Item[]> {
		const items = await this.getItems();
		return items.filter((x): x is Item => x !== null).filter(x => x.tweet === 0);
	}

	public async insertItem(nextItem: Item): Promise<boolean> {
		const id = nextItem.id;

		if (id <= this.defaultID) {
			nextItem.tweet = 1;
		}
		const prevItem = await this.getItem(id);
		if (prevItem !== null) {
			if (prevItem.tweet === -1) {
				prevItem.tweet = 0;
				await this.updateItem(prevItem);
			}
			return false;
		}

		const value = serializeItem(nextItem);
		const field = nextItem.id.toString();
		await this.redis.hset(this.key, field, value);

		return true;
	}

	public async updateItem(nextItem: Item): Promise<boolean> {
		const id = nextItem.id;

		const prevItem = await this.getItem(id);
		if (prevItem === null) {
			return false;
		}
		if (prevItem.tweet === 1) {
			return false;
		}
		if (_.isEqual(prevItem, nextItem)) {
			return false;
		}

		const value = serializeItem(nextItem);
		const field = nextItem.id.toString();
		await this.redis.hset(this.key, field, value);

		return true;
	}

	public async getLastID(): Promise<number> {
		const items = await this.getItems();
		if (items.length === 0) {
			return this.defaultID;
		}
		return items.sort((a, b) => (a.id - b.id)).pop()!.id;
	}
}
