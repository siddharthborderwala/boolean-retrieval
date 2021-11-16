# Boolean Retrieval

This is a Node.js implementation of a boolean retrieval model search engine

## Documents and Vocabulary

We have used the book Pride and Prejudice by Jane Austen, in its text formate created under the Gutenberg Project.

The book comprises of 61 chapters, each has been considered as a document in this project.

The vocabulary size for the same is around 6280.

## How to run project

You need to have [nodejs](https://nodejs.org) (>=12.8.0) installed on your system

Once you clone, to install all the dependencies run

```sh
npm install
```

To build and store the index, run

```sh
npm run once src/scripts/build-and-store-index.js
```

### For development

You can use latest ES syntax thanks to [babel](https://babeljs.io), all code will be transpiled to commonjs for nodejs in the `dist` directory.

To run a particular file in once, run

```sh
npm run once path-to-file/filename.js
```

To work on a particular file in dev mode, run

```sh
npm run dev path-to-file/filename.js
```

This will start a nodemon process with babel-transpiler which will restart automatically on any file changes.

### For Using It

First transpile/build the code for the server using

```sh
npm run build
```

To start the front-end app/client run

```sh
npm run start
```

This will start the server at http://localhost:3000

To start the server on a different port, let's say 8080, run

```sh
npm run start 8080
```

Here are some example queries you can try -

- `"barefaced questions" | ("wish for" & nothing) & free`
- `"barefaced questions" | ("wish for" | nothing) & free`
- `"barefaced questions" & ("wish for" | nothing) & free`
- `"barefaced questions" & ("wish for" | nothing) | free`
- `"barefaced questions" & ("wish for" | nothing | free)`
- `"barefaced questions" & ("wish for" | nothing | free)`

There are some rules for the syntax of the query, if not followed will give an `Invalid Query` error.

To look at the query-rules, you can start the server and go to /help endpoint

## Project Structure

- Library code (core code) is present in the [lib](./src/lib) folder

  - It has three modules
    1. indexing
    2. query
    3. results

- Server code is present in the the [server](./src/server) folder

  - It has a top level app.js file containing the server code
  - It has a views folder containing 4 different views
    1. Home
    2. Results
    3. Invalid Query
    4. Help
  - The index.js file imports the app from app.js and `initializeIndex` function from lib and starts the server

- Scripts folder has various scripts for different purposes

## Contributors

- Siddharth Borderwala [sb943](mailto:sb943@snu.edu.in) - 1910110389
- Sameer Pashikanti [sp674](mailto:sp674@snu.edu.in) - 1910110339
- Ramya Karna [rk408](mailto:sb943@snu.edu.in) - 1910110308
