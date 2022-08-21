import { Item } from '~/models';

export const composeTweet = (item: Item): string => {
	return [`[${item.type}]`, item.title.slice(0, 140), item.link].join('\n');
};
