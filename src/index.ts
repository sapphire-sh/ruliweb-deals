import {
	App,
} from './App';

import {
	sleep,
} from './helpers';

(async () => {
	try {
		const app = new App();

		await app.initialize();

		do {
			await sleep(1000);

			try {
				await app.process();
			}
			catch(err) {
				console.trace(err);
			}

			await sleep(60 * 1000);
		}
		while(true);
	}
	catch(err) {
		console.trace(err);
	}
})();
