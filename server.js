const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/api/generate-map', (req, res) => {
  const Fantmap = require('./src/core/map');
  const map = new Fantmap({
    width: 1024,
    height: 768,
    seed: req.query.seed || Math.random().toString(36).substring(7)
  });
  map.generate();
  
  const canvas = map.render();
  res.set('Content-Type', 'image/png');
  canvas.createPNGStream().pipe(res);
});

app.listen(port, () => {
  console.log(`Fantasy Map Generator running at http://localhost:${port}`);
});