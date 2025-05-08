const fs = require('fs');
const Fantmap = require('../src/core/map');

// Create and generate map
const map = new Fantmap({
  width: 1024,
  height: 768,
  seed: 'myfantasyworld123'
});
map.generate();

// Render and save map
const canvas = map.render();
const out = fs.createWriteStream(__dirname + '/map.png');
const stream = canvas.createPNGStream();
stream.pipe(out);

out.on('finish', () => {
  console.log('Map generated successfully as map.png');
  console.log(`Countries: ${map.countries.length}`);
  console.log(`Cities: ${map.cities.length}`);
  console.log(`Armies: ${map.armies.length}`);
});