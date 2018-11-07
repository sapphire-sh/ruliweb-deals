import Knex from 'knex';

import {
	Item,
} from '../models';

export class Database {
	private static instance: Database | null = null;

	private TABLE_NAME = 'ruliweb_deals';
	private LAST_ID = 21760;

	private knex: Knex;

	private constructor(config: Knex.Config) {
		this.knex = Knex(config);
	}

	public static createInstance(config: Knex.Config) {
		if(this.instance !== null) {
			return;
		}
		this.instance = new Database(config);
	}

	public static getInstance(): Database {
		if(this.instance === null) {
			throw new Error('database instance is not created');
		}
		return this.instance;
	}

	public async initialize() {
		try {
			const exists = await this.knex.schema.hasTable(this.TABLE_NAME);
			if(exists) {
				return;
			}
			return this.knex.schema.createTable(this.TABLE_NAME, (table) => {
				table.integer('id').primary().notNullable();
				table.string('type').notNullable();
				table.string('title').notNullable();
				table.string('link').notNullable();
				table.integer('tweet').notNullable();
				table.timestamp('created_at').defaultTo(this.knex!.fn.now());
			});
		}
		catch(err) {
			console.trace(err);
		}
	}

	public async insert(item: Item) {
		try {
			const rows = await this.knex(this.TABLE_NAME).where({
				'id': item.id,
			});

			if(rows.length === 0) {
				await this.knex(this.TABLE_NAME).insert(item);
			}
		}
		catch(err) {
			console.trace(err);
		}
	}

	public async update(id: string) {
		if(this.knex === null) {
			return;
		}

		try {
			await this.knex(this.TABLE_NAME).where({
				'id': id,
			}).update({
				'tweet': 1,
			});
		}
		catch(err) {
			console.trace(err);
		}
	}

	public async getLastID(): Promise<number> {
		try {
			const rows = await this.knex(this.TABLE_NAME).orderBy('id', 'desc').limit(1);
			if(rows.length === 1) {
				const lastID = parseInt(rows[0].id, 10);
				if(this.LAST_ID > lastID) {
					return this.LAST_ID;
				}
				return lastID;
			}
		}
		catch(err) {
			console.trace(err);
		}
		return this.LAST_ID;
	}

	public async getUntweetedItems(): Promise<Item[]> {
		return this.knex(this.TABLE_NAME).where({
			'tweet': 0,
		});
	}
}
