/**
 * Class for the Node of an AST. This will hold the type of the token
 * and its children if any
 */
class ASTNode {
  /**
   * Type of the token
   *
   * @type {'AND' | 'OR' | 'NOT' | 'TEXT' | 'SDX' | 'BWD' | 'PSN'}
   */
  type;

  /**
   * The children of the node
   *
   * @type {Node | Node[] | string}
   */
  children;

  static types = {
    AND: 'AND',
    OR: 'OR',
    NOT: 'NOT',
    TEXT: 'TEXT',
    SDX: 'SDX',
    BWD: 'BWD',
    PSN: 'PSN',
  };

  /**
   *
   * @param {'AND' | 'OR' | 'NOT' | 'TEXT' | 'SDX' | 'BWD' | 'PSN'} type
   * @param {Node | Node[] | string} children
   */
  constructor(type, children) {
    this.type = type;
    this.children = children;
  }
}

export default ASTNode;
