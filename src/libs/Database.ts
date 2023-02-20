import fs from 'fs';
import { defaultIdPath, lastIdPath } from '~/helpers';
import { Item } from '~/models';

export class Database {
	#lastId: number;

	public constructor() {
		this.#lastId = this.readDefaultId();
		try {
			this.#lastId = this.readLastId();
		} catch {
			this.writeLastId(this.#lastId);
		}
	}

	public get lastId(): number {
		return this.#lastId;
	}

	private readId(path: string): number {
		const buffer = fs.readFileSync(path);
		const data = buffer.toString();
		const value = parseInt(data, 10);

		if (isNaN(value)) {
			throw new Error(`invalid value: ${data}`);
		}

		return value;
	}

	private readDefaultId(): number {
		return this.readId(defaultIdPath);
	}

	private readLastId(): number {
		return this.readId(lastIdPath);
	}

	private writeLastId(id: number) {
		return fs.writeFileSync(lastIdPath, `${id}`);
	}

	public update(item: Item) {
		if (item.id <= this.#lastId) {
			return;
		}

		this.writeLastId(item.id);
		this.#lastId = item.id;
	}
}
