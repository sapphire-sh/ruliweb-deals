import faker from 'faker';
import { BASE_URL } from '~/constants';
import { Parameters } from '~/models';
import { getURL } from '../getURL';

describe('helpers/getURL', () => {
	test('success', () => {
		const parameters: Parameters = {
			page: faker.random.number(),
		};

		const url = getURL(parameters);
		const params = Object.entries(parameters)
			.map(([key, value]) => {
				return `${key}=${encodeURIComponent(value)}`;
			})
			.join('&');
		expect(url).toBe(`${BASE_URL}?${params}`);
	});
});
