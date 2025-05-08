const NameGenerator = require('./src/generators/names');
const map = { seed: 'testseed123' };
const nameGen = new NameGenerator(map);

console.log('Generated Country Names:');
for (let i = 0; i < 5; i++) {
  console.log(nameGen.generateCountryName());
}

console.log('\nGenerated City Names:');
for (let i = 0; i < 5; i++) {
  console.log(nameGen.generateCityName('Test Kingdom'));
}