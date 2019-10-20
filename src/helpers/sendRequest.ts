import request from 'request-promise';

import {
	USER_AGENT,
} from '~/constants';

export async function sendRequest(url: string): Promise<string> {
	return await request({ url, headers: { 'User-Agent': USER_AGENT } });
}
