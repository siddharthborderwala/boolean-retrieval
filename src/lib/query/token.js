import read from '../util/read';

class Token {
  /**
   * Type of the token
   *
   * @type {'AND' | 'OR' | 'NOT' | 'TEXT' | 'LP' | 'RP' | 'BWD' | 'SDX' | 'PSN' | 'EOF'}
   */
  type;

  /**
   * Operator precedence for the token
   *
   * @type {-1 | 0 | 1 | 2 | 3 | 4 | 5}
   */
  precedence;

  /**
   * Value of the token
   */
  value;

  static precedences = {
    none: -1,
    default: 0,
    or: 1,
    and: 2,
    sdx: 3,
    psn: 3,
    not: 4,
  };

  static types = {
    AND: 'AND',
    OR: 'OR',
    NOT: 'NOT',
    TEXT: 'TEXT',
    LP: 'LP',
    RP: 'RP',
    EOF: 'EOF',
    BWD: 'BWD',
    SDX: 'SDX',
    PSN: 'PSN',
  };

  /**
   * Create a token from a string
   *
   * @param {string} candidate The string to tokenize
   */
  constructor(candidate) {
    this.value = candidate;
    if (candidate === '!') {
      this.type = Token.types.NOT;
      this.precedence = Token.precedences.not;
    } else if (candidate === '&') {
      this.type = Token.types.AND;
      this.precedence = Token.precedences.and;
    } else if (candidate === '|') {
      this.type = Token.types.OR;
      this.precedence = Token.precedences.or;
    } else if (candidate === '(') {
      this.type = Token.types.LP;
      this.precedence = Token.precedences.none;
    } else if (candidate === ')') {
      this.type = Token.types.RP;
      this.precedence = Token.precedences.none;
    } else if (candidate === '\n') {
      this.type = Token.types.EOF;
      this.precedence = Token.precedences.none;
    } else if (candidate === '/s') {
      this.type = Token.types.SDX;
      this.precedence = Token.precedences.sdx;
    } else if (candidate.match(/^\/\d+$/)?.length > 0) {
      this.type = Token.types.PSN;
      this.precedence = Token.precedences.psn;
    } else if (candidate.match(/^"[A-Za-z]+ [A-Za-z]+"$/)?.length > 0) {
      this.type = Token.types.BWD;
      this.precedence = Token.precedences.none;
    } else if (candidate.match(/^[A-Za-z]+$/)?.length > 0) {
      this.type = Token.types.TEXT;
      this.precedence = Token.precedences.none;
    } else {
      throw new Error(`Invalid input while creating Token: ${candidate}`);
    }
  }
}

if (require.main === module) {
  read('insert token stuff:\t', (answer) => {
    let t = new Token(answer);
    console.log(t);
  });
}

export default Token;
