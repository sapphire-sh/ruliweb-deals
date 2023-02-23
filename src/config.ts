import { readFileSync } from 'fs';

interface Config {
	consumer_key: string;
	consumer_secret: string;
	access_token: string;
	access_token_secret: string;
};

const config: Config = JSON.parse(readFileSync('./config.json', { encoding: 'utf-8' }));
export default config;

