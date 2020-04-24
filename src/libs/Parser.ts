import cheerio from 'cheerio';

import {
	TABLE_SELECTOR,
} from '~/constants';

import {
	Item,
} from '~/models';

import {
	getURL,
	sendRequest,
} from '~/helpers';

export class Parser {
	public parseItem($: CheerioStatic, e: CheerioElement): Item | null {
		try {
			const column = $(e).find('td').toArray();

			const id = parseInt($(column[0]).text().trim(), 10);
			if (isNaN(id)) {
				return null;
			}
			const type = $(column[1]).text().trim();
			const title = $(column[2]).find('a').text().trim();
			const link = $(column[2]).find('a').attr('href') ?? '';
			const tweet = -1;

			return { id, type, title, link, tweet };
		}
		catch (error) {
			console.log(error);
			return null;
		}
	}

	public async parsePage(page: number): Promise<Item[]> {
		const url = getURL({ page });
		const body = await sendRequest(url);

		const $ = cheerio.load(body);

		const items: Item[] = [];
		$(TABLE_SELECTOR).each((i, e) => {
			const item = this.parseItem($, e);
			if (item === null) { return; }
			items.push(item);
		});
		return items;
	}

	public async parse(): Promise<Item[]> {
		return await this.parsePage(0);
	}
}
