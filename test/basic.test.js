const Fantmap = require('../src/core/map');

describe('Fantmap', () => {
  let map;
  
  beforeAll(() => {
    map = new Fantmap({
      width: 100,
      height: 100,
      seed: 'testseed'
    });
    map.generate();
  });

  test('should initialize correctly', () => {
    expect(map.width).toBe(100);
    expect(map.height).toBe(100);
    expect(map.seed).toBe('testseed');
  });

  test('should generate terrain', () => {
    expect(map.terrain.length).toBe(100);
    expect(map.terrain[0].length).toBe(100);
    expect(typeof map.terrain[0][0]).toBe('string');
  });

  test('should generate countries', () => {
    expect(map.countries.length).toBeGreaterThan(0);
    expect(map.countries[0]).toHaveProperty('name');
    expect(map.countries[0]).toHaveProperty('polygon');
  });

  test('should generate cities', () => {
    expect(map.cities.length).toBeGreaterThan(0);
    expect(map.cities[0]).toHaveProperty('name');
    expect(map.cities[0]).toHaveProperty('position');
  });

  test('should generate armies', () => {
    expect(map.armies.length).toBeGreaterThan(0);
    expect(map.armies[0]).toHaveProperty('countryId');
    expect(map.armies[0]).toHaveProperty('size');
  });
});