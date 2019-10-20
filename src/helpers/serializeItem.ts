import {
	Item,
} from '~/models';

export function serializeItem(item: Item): string {
	return JSON.stringify(item);
}

export function deserializeItem(value: string): Item | null {
	try {
		return JSON.parse(value);
	}
	catch {
		return null;
	}
}
