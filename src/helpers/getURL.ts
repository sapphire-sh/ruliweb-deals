import qs from 'qs';
import { BASE_URL } from '~/constants';
import { Parameters } from '~/models';

export const getURL = (parameters: Parameters): string => {
	return `${BASE_URL}?${qs.stringify(parameters)}`;
};
