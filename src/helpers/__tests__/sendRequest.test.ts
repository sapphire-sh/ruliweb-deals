import { sendRequest } from '../sendRequest';

describe('helpers/sendRequest', () => {
	test('success', async () => {
		const body = await sendRequest('http://httpstat.us/200');
		expect(body).toBe('200 OK');
	});

	test('failure', async () => {
		await expect(sendRequest('http://httpstat.us/500')).rejects.toThrowError();
	});
});
