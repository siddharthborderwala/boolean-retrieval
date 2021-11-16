/**
 * Asynchronously creates the inverted index
 *
 * @param {{id: string; tokens: string[];}[]} tokenizedDocuments Array of file paths of documents
 * @returns {Map<string, number[]>}
 */
const buildSimpleIndex = (tokenizedDocuments) => {
  /**
   * We are using a HashMap for the inverted index as the lookup time is O(1)
   *
   * @type {Map<string, number[]>}
   */
  const invertedIndex = new Map();

  tokenizedDocuments.forEach(({ id, tokens }) => {
    tokens.forEach((token) => {
      // posting list for the current token
      const postingList = invertedIndex.get(token);
      if (!postingList) {
        // if there is no posting list
        invertedIndex.set(token, [id]);
      } else if (postingList && !postingList.includes(id)) {
        // if there is a posting list, but does not include the doc id
        postingList.push(id);
      }
    });
  });

  return invertedIndex;
};

export default buildSimpleIndex;
