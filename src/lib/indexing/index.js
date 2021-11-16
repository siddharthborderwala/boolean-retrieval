/**
 * This module contains code for the pre-processing pipeline.
 * It also contains the code for creating the inverted index,
 * both simple and positional.
 */

import { createIndex, loadTokenizedDocuments } from './common';
import buildPositionalIndex from './positional-index';
import buildSimpleIndex from './simple-index';
import buildSoundexIndex from './soundex-index';

/**
 * @type {Map<string, number[]>}
 */
export let simpleIndex = null;

/**
 * @type {Map<string, {id: string; position: number;}[]>}
 */
export let positionalIndex = null;

/**
 * @type {Map<string, number[]>}
 */
export let soundexIndex = null;

export const initializeIndexes = async (returnIndexes = false) => {
  const tokenizedDocs = await loadTokenizedDocuments();
  simpleIndex = createIndex(tokenizedDocs, buildSimpleIndex);
  positionalIndex = createIndex(tokenizedDocs, buildPositionalIndex);
  soundexIndex = createIndex(tokenizedDocs, buildSoundexIndex);
  if (returnIndexes)
    return {
      simpleIndex,
      positionalIndex,
      soundexIndex,
    };
};

export * from './persist';
