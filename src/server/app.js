import path from 'path';
import express from 'express';
import logger from 'morgan';
import favicon from 'serve-favicon';

import { Parser, evaluate } from '../lib';

const app = express();

app.use(favicon(path.join(__dirname, 'static', 'favicon.ico')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// the home page
app.get('/', (req, res) => {
  res.render('home', {});
});

// help page
app.get('/help', (req, res) => {
  res.render('help', {});
});

// post the query to the server
app.post('/query', (req, res) => {
  const query = req.body.query;
  if (!query || query.trim().length === 0) {
    res.redirect('/');
    return;
  }
  const parser = new Parser(query);
  try {
    const ast = parser.parse();
    const docIdList = evaluate(ast);
    res.render('results', {
      query,
      ast: JSON.stringify(ast, null, 2),
      list: docIdList.map((id) => ({ id, link: `/doc/${id}` })),
    });
  } catch (err) {
    console.log(err);
    res.render('invalid-query', {
      query,
    });
  }
});

// returns the doc with the id
app.get('/doc/:id/:range?', (req, res) => {
  const id = req.params.id;
  const range = req.params.range;
  if (range) {
    // send only -25 ... the specified part ... +25
  } else {
    res.sendFile(path.join(__dirname, `../../data/documents/${id}.txt`));
  }
});

export default app;
