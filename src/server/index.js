import { initializeIndexes } from '../lib';
import app from './app';

initializeIndexes().then(() => {
  const PORT = process.argv[2] ?? '3000';
  app.listen(PORT, (err) => {
    if (err) {
      console.log('💥 Error occurred:', err);
    } else {
      console.log(
        `🚀 Server listening on port ${PORT} - go to http://localhost:${PORT}`
      );
    }
  });
});
