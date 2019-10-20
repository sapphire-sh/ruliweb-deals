import {
	Parser,
} from '../Parser';

describe('libs/Parser', () => {
	const parser = new Parser();

	describe('parsePage', () => {
		test('success', async () => {
			const page = 0;

			const items = await parser.parsePage(page);

			expect(items).toHaveLength(28);
		});
	});

	describe('parse', () => {
		test('success', async () => {
			const items = await parser.parse();
			expect(items).toHaveLength(28);
		});
	});
});
