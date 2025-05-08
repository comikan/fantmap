const seedrandom = require('seedrandom');

class FeaturesGenerator {
  constructor(map) {
    this.map = map;
    this.rng = new seedrandom(map.seed);
    this.nameGenerator = new (require('./names'))(map);
  }

  generate() {
    this.map.cities = [];
    this.map.landmarks = [];
    
    this.map.countries.forEach((country, countryId) => {
      this._generateCities(country, countryId);
      this._generateLandmarks(country, countryId);
    });
  }

  _generateCities(country, countryId) {
    const cityCount = 2 + Math.floor(this.rng() * 3);
    const polygon = country.polygon.geometry.coordinates[0];
    
    for (let i = 0; i < cityCount; i++) {
      const position = this._findCityPosition(polygon, i);
      const isCapital = i === 0;
      
      this.map.cities.push({
        id: `${countryId}-city-${i}`,
        countryId,
        name: this.nameGenerator.generateCityName(country.name),
        position,
        size: isCapital ? 'large' : this.rng() > 0.7 ? 'medium' : 'small',
        type: isCapital ? 'capital' : 'normal'
      });
    }
  }

  _generateLandmarks(country, countryId) {
    if (this.rng() > 0.7) {
      const polygon = country.polygon.geometry.coordinates[0];
      const position = this._findLandmarkPosition(polygon);
      
      this.map.landmarks.push({
        id: `${countryId}-landmark-${this.map.landmarks.length}`,
        countryId,
        position,
        name: this._generateLandmarkName(country.name)
      });
    }
  }

  _findCityPosition(polygon, index) {
    const points = polygon.slice(0, -1);
    const center = points.reduce((acc, point) => {
      return [acc[0] + point[0] / points.length, acc[1] + point[1] / points.length];
    }, [0, 0]);
    
    const point = points[index % points.length];
    return [
      point[0] + (center[0] - point[0]) * 0.3,
      point[1] + (center[1] - point[1]) * 0.3
    ];
  }

  _findLandmarkPosition(polygon) {
    const points = polygon.slice(0, -1);
    const point = points[Math.floor(this.rng() * points.length)];
    return [point[0], point[1]];
  }

  _generateLandmarkName(countryName) {
    const prefixes = ['Great', 'Ancient', 'Mysterious', 'Sacred'];
    const suffixes = ['Peak', 'Lake', 'Forest', 'Ruins'];
    return `${this._randomElement(prefixes)} ${this._randomElement(suffixes)}`;
  }

  _randomElement(array) {
    return array[Math.floor(this.rng() * array.length)];
  }
}

module.exports = FeaturesGenerator;