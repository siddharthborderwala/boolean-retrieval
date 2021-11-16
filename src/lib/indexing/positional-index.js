/**
 * Asynchronously creates the inverted index
 *
 * @param {{id: string; tokens: string[];}[]} tokenizedDocuments Array of file paths of documents
 * @returns {Map<string, {id: string; positions: number[];}[]>}
 */
const buildPositionalIndex = (tokenizedDocuments) => {
  /**
   * We are using a HashMap for the positional index as the lookup time is O(1)
   *
   * @type {Map<string, {id: string; positions: number[];}[]>}
   */
  const positionalIndex = new Map();

  tokenizedDocuments.forEach(({ id, tokens }) => {
    tokens.forEach((token, index) => {
      // posting list for the current token
      const postingList = positionalIndex.get(token);
      if (!postingList) {
        // if there is no posting list, create one and set it as the value for the key
        positionalIndex.set(token, [{ id, positions: [index] }]);
      } else if (postingList) {
        const node = postingList.find((o) => o.id === id);
        // if there is a posting list
        if (node === undefined) {
          // but does not include the doc id
          postingList.push({ id, positions: [index] });
        } else {
          // already came across the doc id before
          node.positions.push(index);
        }
      }
    });
  });

  return positionalIndex;
};

export default buildPositionalIndex;
