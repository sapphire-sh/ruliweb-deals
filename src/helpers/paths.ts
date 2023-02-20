import path from 'path';
import { DEFAULT_ID_FILENAME, LAST_ID_FILENAME } from '~/constants';

export const rootPath = path.resolve(__dirname, '..', '..');
export const dataPath = path.resolve(rootPath, 'data');
export const defaultIdPath = path.resolve(dataPath, DEFAULT_ID_FILENAME);
export const lastIdPath = path.resolve(dataPath, LAST_ID_FILENAME);
