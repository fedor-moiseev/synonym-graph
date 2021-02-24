# Synonyms Graph

> A simple tool that lets you browse a graph of synonyms for any word

## Built with

- [Express](http://expressjs.com)
- [cheerio](https://www.npmjs.com/package/cheerio)
- [make-fetch-happen](https://www.npmjs.com/package/make-fetch-happen)
- [pug](https://www.npmjs.com/package/pug)
- [Primer](primer.style)
- [vis.js](https://visjs.org)

## How it works

Server scrapes thesaurus.com for the requested word, then individual synonyms of that word. Parsed data then renders on front-end as a network graph using vis.js.

## Installing

```
yarn --dev
```

## Running

```
yarn start
```
