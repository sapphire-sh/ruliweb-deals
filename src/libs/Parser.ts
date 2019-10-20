import request from 'request';
import cheerio from 'cheerio';

import {
	Item,
} from '~/models';

export class Parser {
	private static instance: Parser | null = null;

	private readonly BASE_URL = `http://bbs.ruliweb.com/news/board/1020/list`;
	private readonly TABLE_SELECTOR = `table.board_list_table tr.table_body:not(.notice)`;

	private items: Item[];

	private constructor() {
		this.items = [];
	}

	public static createInstance() {
		if(this.instance !== null) {
			return;
		}
		this.instance = new Parser();
	}

	public static getInstance(): Parser {
		if(this.instance === null) {
			throw new Error('parser instance is not created');
		}
		return this.instance;
	}

	private getURL(page: number) {
		return `${this.BASE_URL}?page=${page}`;
	}

	private sendRequest(page: number): Promise<any> {
		const url = this.getURL(page);

		console.log(url);

		return new Promise((resolve, reject) => {
			request({
				'url': url,
				'timeout': 10000,
			}, (err, res, body) => {
				if(err || res.statusCode !== 200) {
					return reject(err);
				}
				resolve(body);
			});
		});
	}

	public async parse(id: number, page: number): Promise<Item[]> {
		this.items = [];

		try {
			const body = await this.sendRequest(page);
			const $ = cheerio.load(body);

			$(this.TABLE_SELECTOR).each((_, e) => {
				const item: any = {};

				item.tweet = 0;

				$(e).find('td').each((i, e) => {
					const str = $(e).text().trim();
					switch(i) {
					case 0:
						item.id = str;
						break;
					case 1:
						item.type = str;
						break;
					case 2:
						item.title = $(e).find('a').text().trim();
						item.link = $(e).find('a').attr('href');
						break;
					}
				});

				if(parseInt(item.id, 10) > id) {
					this.items.push(item);
				}
			});

			return this.items;
		}
		catch(err) {
			console.trace(err);
			return [];
		}
	}
}
