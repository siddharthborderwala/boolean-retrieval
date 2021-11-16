import { readdir as readDir, readFile } from 'fs/promises';
import path from 'path';

import wink from 'wink-nlp-utils';

// import stopWordsRaw from '../../../data/lists/stop-words.json';

// const stopWords = new Set(stopWordsRaw);

export const getDocumentPaths = async (folderPath) => {
  return (await readDir(folderPath))
    .map((file) => path.resolve(folderPath, file))
    .sort((a, b) => {
      const aNum = parseInt(a.split('\\').pop().split('.').shift(), 10);
      const bNum = parseInt(b.split('\\').pop().split('.').shift(), 10);
      return aNum - bNum;
    });
};

// Collection of documents to be indexed
export const getTokensFromDocument = async (filePath) => {
  const data = await readFile(filePath);

  /**
   * Converts the input string to lower case.
   */
  const caseFoldedString = data.toString().toLowerCase();

  /**
   * Tokenize by splitting the input string on non-words.
   * This means tokens would consists of only alphas,
   * numerals and underscores; all other characters will
   * be stripped as they are treated as separators. It
   * also removes all elisions; however negations are
   * retained and amplified.
   *
   */
  const tokens = wink.string.tokenize(caseFoldedString);

  /**
   * Stems an inflected word using Porter2 Algorithm
   * [https://tartarus.org/martin/PorterStemmer/]
   */
  // const stemmedTokens = tokens.map((token) => wink.string.stem(token));

  return tokens;
};

export const loadTokenizedDocuments = async () => {
  const docPaths = await getDocumentPaths(
    path.join(__dirname, '../../../data/documents')
  );
  return (
    await Promise.all(docPaths.map((fp) => getTokensFromDocument(fp)))
  ).map((tokens, index) => ({
    id: index + 1,
    tokens,
  }));
};

export const createIndex = (tokenizedDocuments, buildIndex) => {
  return buildIndex(tokenizedDocuments);
};

if (require.main === module) {
  getDocumentPaths(path.join(__dirname, '../../../data/documents'))
    .then((paths) => {
      console.log(paths);
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
