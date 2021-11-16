import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const read = (query, cb) => rl.question(query, cb);

export default read;
