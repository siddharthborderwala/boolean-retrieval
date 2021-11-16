import wink from 'wink-nlp-utils';

/**
 * Asynchronously creates the soundex index
 *
 * @param {{id: string; tokens: string[];}[]} tokenizedDocuments Array of file paths of documents
 * @returns {Map<string, number[]>}
 */
const buildSoundexIndex = (tokenizedDocuments) => {
  /**
   * We are using a HashMap for the soudnex index as the lookup time is O(1)
   *
   * @type {Map<string, number[]>}
   */
  const soundexIndex = new Map();

  tokenizedDocuments.forEach(({ id, tokens }) => {
    wink.tokens.soundex(tokens).forEach((token) => {
      // posting list for the current token
      const postingList = soundexIndex.get(token);
      if (!postingList) {
        // if there is no posting list
        soundexIndex.set(token, [id]);
      } else if (postingList && !postingList.includes(id)) {
        // if there is a posting list, but does not include the doc id
        postingList.push(id);
      }
    });
  });

  return soundexIndex;
};

export default buildSoundexIndex;
