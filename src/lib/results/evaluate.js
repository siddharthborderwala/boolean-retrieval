import wink from 'wink-nlp-utils';

import { positionalIndex, simpleIndex, soundexIndex } from '../indexing';
import ASTNode from '../query/ast-node';
import {
  intersection,
  negation,
  proximityIntersection,
  union,
} from './algorithms';

/**
 * Evaluate the AST node
 *
 * @param {ASTNode} node
 * @param {Map<string, number[]>} index
 *
 * @returns {Array<number>}
 */
const evaluate = (node) => {
  // need to use the posting lists of the children and not the children themselves
  switch (node.type) {
    case 'AND': {
      return intersection(
        evaluate(node.children[0]),
        evaluate(node.children[1])
      );
    }
    case 'OR':
      return union(evaluate(node.children[0]), evaluate(node.children[1]));
    case 'NOT':
      return negation(evaluate(node.children), 61);
    case 'BWD': {
      const child = node.children;
      if (typeof child !== 'string') {
        throw new Error(
          `Bi-word Evaluation - Expected child children of type 'string', got ${typeof child}`
        );
      }
      const [word1, word2] = child.slice(1, child.length - 1).split(' ');
      return proximityIntersection(
        1,
        positionalIndex.get(word1) ?? [],
        positionalIndex.get(word2) ?? [],
        true
      );
    }
    case 'PSN': {
      const distance = node.children[0];
      const left_child = node.children[1];
      const right_child = node.children[2];
      if (left_child.type !== ASTNode.types.TEXT) {
        throw new Error(
          `Positional Evaluation - Expected left-child of type 'TEXT', got ${left_child.type}`
        );
      } else if (right_child.type !== ASTNode.types.TEXT) {
        throw new Error(
          `Positional Evaluation - Expected right-child of type 'TEXT', got ${right_child.type}`
        );
      }
      return proximityIntersection(
        distance,
        positionalIndex.get(left_child.children) ?? [],
        positionalIndex.get(right_child.children) ?? []
      );
    }
    case 'SDX': {
      /**
       * @type {ASTNode}
       */
      const child = node.children;
      if (child.type !== 'TEXT') {
        throw new Error(
          `Soundex Evaluation - Expected child node of type 'TEXT', got ${child.type}`
        );
      }
      return soundexIndex.get(wink.string.soundex(child)) ?? [];
    }
    case 'TEXT':
      return simpleIndex.get(node.children) ?? [];
    default:
      throw new Error('Invalid node');
  }
};

export default evaluate;
