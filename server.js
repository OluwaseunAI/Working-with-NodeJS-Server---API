const http = require('node:http');
const url = require('node:url');

let db = [];

const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url, true);

  if (req.method === 'GET' && reqUrl.pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(db));
  } else if (req.method === 'POST' && reqUrl.pathname === '/') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const newJoke = JSON.parse(body);
      newJoke.id = db.length + 1;
      db.push(newJoke);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(db));
    });
  } else if (req.method === 'PATCH' || req.method === 'DELETE') {
    const jokeId = parseInt(reqUrl.pathname.split('/')[2]);

    if (req.method === 'PATCH') {
      let body = '';

      req.on('data', (chunk) => {
        body += chunk.toString();
      });

      req.on('end', () => {
        const updatedJoke = JSON.parse(body);
        const index = db.findIndex((joke) => joke.id === jokeId);

        if (index !== -1) {
          db[index] = { ...db[index], ...updatedJoke };
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(db[index]));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Joke not found' }));
        }
      });
    } else if (req.method === 'DELETE') {
      const index = db.findIndex((joke) => joke.id === jokeId);

      if (index !== -1) {
        const deletedJoke = db.splice(index, 1);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(deletedJoke));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Joke not found' }));
      }
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Endpoint not found' }));
  }
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
