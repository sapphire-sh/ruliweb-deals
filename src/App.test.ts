'use strict';

import {
	App,
} from './App';

const app = new App();

describe('@ruliweb_deals', () => {
	it('intialize', async () => {
		await app.initialize();
	});

	it('process', async () => {
		await app.process();
	});
});
