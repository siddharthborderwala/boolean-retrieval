/**
 * This file contains the script to create individual documents from the Pride and Prejudice
 * book by Jane Austen.
 *
 * The documents are individual chapters.
 */

import fs from 'fs/promises';
import path from 'path';

/**
 * Creates documents from the text file containing the book and stores them in
 * the data/documents folder with the file-name as <chapter-number>.txt
 */
const createDocuments = async () => {
  try {
    const book = await fs.readFile(
      path.join(__dirname, '../../data/book/pride-and-prejudice.txt'),
      'utf-8'
    );
    const chapters = [];

    let counter = 0;
    let text = [];
    let recording = false;
    for (let i = 0; i < book.length; ) {
      if (book[i] + book[i + 1] + book[i + 2] === '<c>') {
        counter++;
        i += 3;
        recording = true;
      } else if (book[i] + book[i + 1] + book[i + 2] + book[i + 3] === '</c>') {
        i += 4;
        recording = false;
        chapters.push({
          n: counter,
          text: text.join('').trim().replace(/ {6}/g, ''),
        });
        text = [];
      } else {
        if (recording) {
          text.push(book[i]);
        }
        i++;
      }
    }
    const promises = [];

    await Promise.all(
      chapters.map(({ n, text }) =>
        fs.writeFile(
          path.join(__dirname, `../../data/documents/${n}.txt`),
          text,
          'utf-8'
        )
      )
    );

    const { length } = await Promise.all(promises);
    console.log(`${length} documents created.`);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

if (require.main === module) {
  createDocuments();
}
