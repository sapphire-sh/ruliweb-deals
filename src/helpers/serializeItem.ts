import { Item } from '~/models';

export const serializeItem = (item: Item): string => {
	return JSON.stringify(item);
};

export const deserializeItem = (value: string): Item | null => {
	try {
		return JSON.parse(value);
	} catch {
		return null;
	}
};
