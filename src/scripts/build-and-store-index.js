import { initializeIndexes, pruneIndexes, storeIndex } from '../lib';

/**
 * Builds simple-index, positional-index and soundex-index and stores them in
 * files under the /data/indexes folder in JSON formats.
 */
const buildAndStoreIndex = async () => {
  try {
    const { simpleIndex, positionalIndex, soundexIndex } =
      await initializeIndexes(true);
    // remove older indexes
    await pruneIndexes();
    // store indexes
    await storeIndex(simpleIndex, 'simple.json');
    console.log(`Stored simple-index with ${simpleIndex.size} entries`);
    await storeIndex(positionalIndex, 'positional.json');
    console.log(`Stored positional-index with ${positionalIndex.size} entries`);
    await storeIndex(soundexIndex, 'soundex.json');
    console.log(`Stored soundex-index with ${soundexIndex.size} entries`);
    // exit with code 0
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

if (require.main === module) {
  buildAndStoreIndex();
}
