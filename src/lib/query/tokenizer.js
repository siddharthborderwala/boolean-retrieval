// import wink from 'wink-nlp-utils';
import read from '../util/read';

import Token from './token';

const normalizeQuery = (q) =>
  q
    .replace(/\s+(?=(?:(?:[^"]*"){2})*[^"]*"[^"]*$)/g, '<s>')
    .replace(/\./, '')
    .split(' ')
    .map((v) => {
      if (v.includes('<s>')) return v.split('<s>').join(' ');
      else return v;
    })
    .join('');

/**
 *
 * @param {string} input
 *
 * @returns {{ next: () => Token; }}
 */
function tokenizer(input) {
  let index = 0;
  const expression = normalizeQuery(input);

  const incrementIndex = () => (index += 1);

  return {
    next: () => {
      const c = expression[index];

      if (index === expression.length) {
        incrementIndex();
        return new Token('\n');
      } else if (c === '/') {
        if (expression[index + 1] === 's') {
          incrementIndex();
          incrementIndex();
          return new Token('/s');
        } else {
          let acc = c;
          incrementIndex();
          while (expression[index]?.match(/\d/)?.length > 0) {
            acc += expression[index];
            incrementIndex();
          }
          return new Token(acc);
        }
      } else if (c === '"') {
        let acc = c;
        while (expression[index + 1]?.match(/([A-Za-z]| |")/)?.length > 0) {
          acc += expression[index + 1];
          incrementIndex();
        }
        incrementIndex();
        return new Token(acc.toLowerCase());
      } else if (c.match(/[A-Za-z]/)?.length > 0) {
        let acc = c;
        while (expression[index + 1]?.match(/[A-Za-z]/)?.length > 0) {
          acc += expression[index + 1];
          incrementIndex();
        }
        incrementIndex();
        return new Token(acc.toLowerCase());
      } else {
        incrementIndex();
        return new Token(c);
      }
    },
  };
}

if (require.main === module) {
  read('enter query:\t', (answer) => {
    let t = tokenizer(answer);
    let token;
    while ((token = t.next()).type !== 'EOF') {
      console.log(token);
    }
  });
}

export default tokenizer;
