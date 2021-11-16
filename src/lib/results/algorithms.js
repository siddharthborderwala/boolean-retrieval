/**
 * This data-structure stores the integer id of the document in which a
 * particular token occurs.
 */

/**
 * Returns the intersection of two lists, i.e. the common elements
 *
 * @param {Array<number>} list1 List
 * @param {Array<number>} list2 List
 * @returns {Array<number>}
 */
export const intersection = (list1, list2) => {
  if (list1.length == 0 || list2.length == 0) {
    return [];
  }
  let i = 0;
  let j = 0;
  const result = [];
  while (i < list1.length && j < list2.length) {
    let a = list1[i];
    let b = list2[j];
    if (a > b) {
      j++;
    } else if (b > a) {
      i++;
    } else {
      if (i === list1.length || j === list2.length) break;
      result.push(a);
      i++;
      j++;
    }
  }
  return result;
};

/**
 * Returns the union of both the lists, i.e. all elements from both lists
 *
 * @param {Array<number>} list1 List
 * @param {Array<number>} list2 List
 * @returns {Array<number>}
 */
export const union = (list1, list2) => {
  if (list1.length == 0 && list2.length == 0) {
    return [];
  }
  let i = 0;
  let j = 0;
  const result = [];
  const goOn = true;
  while (goOn) {
    if (i === list1.length) {
      while (j < list2.length) {
        result.push(list2[j]);
        j++;
      }
      break;
    } else if (j === list2.length) {
      while (i < list1.length) {
        result.push(list1[i]);
        i++;
      }
      break;
    }

    if (list1[i] > list2[j]) {
      result.push(list2[j]);
      j++;
    } else if (list1[i] < list2[j]) {
      result.push(list1[i]);
      i++;
    } else {
      result.push(list1[i]);
      i++;
      j++;
    }
  }
  return result;
};

/**
 * Return the elements not present in the list.
 * Precondition - the ids of documents must be an AP of integers with difference 1
 *
 * @param {Array<number>} list List
 * @param {number} totalDocs Total number of documents
 * @returns {Array<number>}
 */
export const negation = (list, totalDocs) => {
  let i = 0;
  const result = [];
  for (let j = 1; j <= totalDocs; ++j) {
    if (list[i] === j) {
      i++;
    } else {
      result.push(j);
    }
  }
  return result;
};

/**
 * Intersection of two positional posting-lists
 *
 * @param {number} distance Distance between two tokens
 * @param {Array<{id: number; positions: Array<number>;}>} token1List First token
 * @param {Array<{id: number; positions: Array<number>;}>} token2List Second token
 * @param {boolean} isOrdered Preserve the order of the tokens while getting results
 * @returns {Array<number>}
 */
export const proximityIntersection = (
  distance,
  token1List,
  token2List,
  isOrdered = false
) => {
  if (token1List.length == 0 || token2List.length == 0) {
    return [];
  }
  let i = 0;
  let j = 0;
  const result = [];
  while (i < token1List.length && j < token2List.length) {
    const a = token1List[i];
    const b = token2List[j];
    if (a.id > b.id) {
      j++;
    } else if (b.id > a.id) {
      i++;
    } else {
      if (i === token1List.length || j === token2List.length) break;
      const aPositions = a.positions;
      const bPositions = b.positions;
      let goOn = true;
      for (let i = 0; i < aPositions.length && goOn; i++) {
        const aElem = aPositions[i];
        for (let j = i; j < bPositions.length && goOn; j++) {
          const bElem = bPositions[j];
          const diff = aElem - bElem;
          if (
            (isOrdered && diff <= distance) ||
            (!isOrdered && Math.abs(diff) <= distance)
          ) {
            result.push(a.id);
            goOn = false;
          }
        }
      }
      i++;
      j++;
    }
  }
  return result;
};
