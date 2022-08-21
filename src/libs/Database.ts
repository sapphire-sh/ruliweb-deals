import IORedis from 'ioredis';
import { deserializeItem, itemEquals, serializeItem } from '~/helpers';
import { Item } from '~/models';

export class Database {
	public constructor(private readonly redis: IORedis.Redis) {}

	public get key(): string {
		return 'ruliweb_deals';
	}

	public get defaultId(): number {
		return 49304;
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
		const res: { [key: string]: string } = await this.redis.hgetall(this.key);

		const items = Object.values(res).map((x) => deserializeItem(x));
		return items.filter((x): x is Item => x !== null);
	}

	public async getUntweetedItems(): Promise<Item[]> {
		const items = await this.getItems();
		return items.filter((x): x is Item => x !== null).filter((x) => x.tweet === 0);
	}

	public async insertItem(nextItem: Item): Promise<boolean> {
		const id = nextItem.id;

		if (id <= this.defaultId) {
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
		if (itemEquals(prevItem, nextItem)) {
			return false;
		}

		const value = serializeItem(nextItem);
		const field = nextItem.id.toString();
		await this.redis.hset(this.key, field, value);

		return true;
	}

	public async getLastId(): Promise<number> {
		const items = await this.getItems();
		if (items.length === 0) {
			return this.defaultId;
		}
		return items.sort((a, b) => a.id - b.id).pop()!.id;
	}
}
