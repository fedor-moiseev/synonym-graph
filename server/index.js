const fetch = require('make-fetch-happen').defaults({
  cacheManager: '../cache',
});
const cheerio = require('cheerio');
const express = require('express');

const baseUrl = 'https://www.thesaurus.com/browse';
const port = process.env.port || 3000;

const app = express();
app.set('view engine', 'pug');

const getWord = async (word) => {
  const url = `${baseUrl}/${encodeURIComponent(word)}`;
  const html = await (await fetch(url)).text();
  const $ = cheerio.load(html);
  const synonyms = $('#meanings li')
    .get()
    .map((synonym) => $(synonym).text().trim());
  return synonyms;
};

const getTree = async (word, depth) => {
  if (depth <= 0) return [word];
  const children = await getWord(word);
  return [
    word,
    await Promise.all(children.map((child) => getTree(child, depth - 1))),
  ];
};

const colors = ['#60a5fa', '#34d399', '#fbbf24'];

const getNodes = (inputTree) => {
  let id = 0;
  const nodes = [];
  const edges = [];

  const get = (tree, to, level = 2) => {
    const [word, children] = tree;
    id += 1;
    nodes.push({ id, label: word, color: colors[level - 0] });
    if (to) {
      edges.push({ from: id, to, value: level });
    }
    const thisId = id;
    children?.map((child) => get(child, thisId, level - 1));
  };
  get(inputTree);
  return [nodes, edges];
};

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/word', async (req, res) => {
  const { word } = req.query;
  if (word) {
    try {
      const tree = await getTree(word, 2);
      const [nodes, edges] = getNodes(tree);
      const nodesB64 = Buffer.from(JSON.stringify(nodes), 'utf-8').toString(
        'base64',
      );
      const edgesB64 = Buffer.from(JSON.stringify(edges), 'utf-8').toString(
        'base64',
      );
      res.render('word', {
        nodes: nodesB64,
        edges: edgesB64,
        title: `${word}`,
      });
      return;
    } catch (error) {
      res.status(400).render('404', { message: 'Word not found' });
      return;
    }
  }
  res.status(400).render('404', { message: 'Nothing there' });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
