import { appendFile, readFile, rm, mkdir } from 'fs/promises';
import path from 'path';

import { stringifyMap, parseMap } from '../util/map-util';

/**
 * Store the index in a file
 *
 * @param {string} filename Name of the file
 * @param {Map<string, number[]>} index Index
 *
 * @returns {Promise<void>}
 */
export const storeIndex = async (index, filename = 'simple.txt') => {
  await appendFile(
    path.join(__dirname, '../../../data/indexes/', filename),
    stringifyMap(index),
    'utf-8'
  );
};

/**
 * Retrieves and parses index from a file
 *
 *
 * @param {string} filePath Path of the file
 *
 * @returns {Promise<Map<string, number[]>>}
 */
export const retrieveIndex = async (filename) => {
  const mapString = await readFile(
    path.join(path.join(__dirname, '../../../data/indexes', filename)),
    'utf-8'
  );
  return parseMap(mapString);
};

export const pruneIndexes = async () => {
  await rm(path.join(__dirname, '../../../data/indexes/'), {
    recursive: true,
    force: true,
  });
  await mkdir(path.join(__dirname, '../../../data/indexes/'));
};
