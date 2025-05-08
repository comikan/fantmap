const TerrainGenerator = require('../generators/terrain');
const BorderGenerator = require('../generators/borders');
const ArmyGenerator = require('../generators/armies');
const FeaturesGenerator = require('../generators/features');
const Renderer = require('./renderer');
const seedrandom = require('seedrandom');

class Fantmap {
  constructor(options = {}) {
    this.width = options.width || 1024;
    this.height = options.height || 768;
    this.seed = options.seed || Math.random().toString(36).substring(7);
    this.rng = new seedrandom(this.seed);
    
    this.terrain = [];
    this.elevation = [];
    this.moisture = [];
    this.countries = [];
    this.armies = [];
    this.cities = [];
    this.landmarks = [];
    
    this.generators = {
      terrain: new TerrainGenerator(this),
      borders: new BorderGenerator(this),
      armies: new ArmyGenerator(this),
      features: new FeaturesGenerator(this)
    };
    
    this.renderer = new Renderer(this);
  }

  generate() {
    console.log(`Generating map with seed: ${this.seed}`);
    this.generators.terrain.generate();
    this.generators.borders.generate();
    this.generators.armies.generate();
    this.generators.features.generate();
    return this;
  }

  render() {
    return this.renderer.render();
  }

  getCountryAt(x, y) {
    for (const country of this.countries) {
      if (this._pointInPolygon([x, y], country.polygon.geometry.coordinates[0])) {
        return country;
      }
    }
    return null;
  }

  _pointInPolygon(point, polygon) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0], yi = polygon[i][1];
      const xj = polygon[j][0], yj = polygon[j][1];
      
      const intersect = ((yi > point[1]) !== (yj > point[1]))
        && (point[0] < (xj - xi) * (point[1] - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }
}

module.exports = Fantmap;