import { App } from './App';

const main = async () => {
	const app = new App();
	await app.start();
};

(async () => {
	try {
		await main();
	} catch (error) {
		console.log(error);
	}
})();
