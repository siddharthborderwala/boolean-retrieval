import read from '../util/read';
import ASTNode from './ast-node';
import Token from './token';

import tokenizer from './tokenizer';

class Parser {
  /**
   * String to store the raw user query
   *
   * @type {string}
   */
  expression;

  /**
   * It is an iterator and it spits tokens from the expression.
   * It is used in the generateAST method.
   *
   * @type {{ next: () => Token; }}
   */
  tokenizer;

  /**
   * The current token emitted by the tokenizer
   *
   * @type {Token}
   */
  currentToken;

  /**
   * Creates a query object
   *
   * @param {string} query A string query from the user
   */
  constructor(query) {
    this.expression = query;
    this.tokenizer = tokenizer(query);
    this.currentToken = this.tokenizer.next();
  }

  getNextToken() {
    this.currentToken = this.tokenizer.next();
  }

  /**
   * Converts the query expression into an abstract-syntax-tree (AST).
   * This AST is then evaluated to generate the query result.
   *
   * @returns {ASTNode} The AST generated from the query
   */
  parse() {
    return this.generateAst(Token.precedences.default);
  }

  /**
   * Generates the ast for a particular token
   *
   * @param {-1 | 0 | 1 | 2 | 3} operatorPrecedence
   */
  generateAst(operatorPrecedence) {
    let leftExpression = this.parseSubQuery();

    while (operatorPrecedence < this.currentToken.precedence) {
      if (this.currentToken.type === 'EOF') {
        break;
      }
      leftExpression = this.getOperatorNode(leftExpression);
    }

    return leftExpression;
  }

  /**
   * Parses a sub-query
   *
   * @returns {ASTNode}
   */
  parseSubQuery() {
    const token = this.currentToken;
    switch (token.type) {
      case 'LP': {
        this.getNextToken();
        let expression = this.generateAst(Token.precedences.default);
        if (')' !== this.currentToken.value) {
          throw new Error(`Expected ')' got '${this.currentToken.value}'`);
        } else {
          this.getNextToken();
        }
        return expression;
      }
      case 'NOT': {
        this.getNextToken();
        let expression = this.generateAst(Token.precedences.not);
        return new ASTNode('NOT', expression);
      }
      case 'BWD': {
        let expression = new ASTNode('BWD', token.value);
        this.getNextToken();
        return expression;
      }
      case 'SDX': {
        this.getNextToken();
        let textToken = this.currentToken;
        if (textToken.type !== 'TEXT') {
          throw new Error('A soundex should be followed by a text token');
        }
        this.getNextToken();
        return new ASTNode('SDX', new ASTNode('TEXT', textToken.value));
      }
      case 'TEXT': {
        let expression = new ASTNode('TEXT', token.value);
        this.getNextToken();
        return expression;
      }
      default: {
        throw new Error('Invalid character token');
      }
    }
  }

  /**
   * Convert the token to a node
   *
   * @param {ASTNode} leftExpression
   * @returns {ASTNode}
   */
  getOperatorNode(leftExpression) {
    switch (this.currentToken.type) {
      case 'AND': {
        this.getNextToken();
        let rightExpression = this.generateAst(Token.precedences.and);
        return new ASTNode('AND', [leftExpression, rightExpression]);
      }
      case 'OR': {
        this.getNextToken();
        let rightExpression = this.generateAst(Token.precedences.or);
        return new ASTNode('OR', [leftExpression, rightExpression]);
      }
      case 'NOT': {
        this.getNextToken();
        let rightExpression = this.generateAst(Token.precedences.not);
        return new ASTNode('NOT', rightExpression);
      }
      case 'PSN': {
        let position = parseInt(this.currentToken.value.slice(1));
        this.getNextToken();
        let rightExpression = this.generateAst(Token.precedences.psn);
        if (rightExpression.type !== 'TEXT') {
          throw new Error(
            'Operands for positional operator must be single text words'
          );
        }
        return new ASTNode('PSN', [position, leftExpression, rightExpression]);
      }
    }
  }
}

if (require.main === module) {
  read('insert a new query:\t', (answer) => {
    let p = new Parser(answer);
    try {
      const root = p.parse();
      console.log(JSON.stringify(root, null, 2));
    } catch (e) {
      console.error(e);
    }
  });
}

export default Parser;
