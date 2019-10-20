import {
	Item,
} from '~/models';

export function composeTweet(item: Item): string {
	return [
		`[${item.type}]`,
		item.title.substr(0, 140),
		item.link,
	].join('\n');
}
