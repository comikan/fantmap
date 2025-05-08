const Noise = require('../utils/noise');

class TerrainGenerator {
  constructor(map) {
    this.map = map;
    this.noise = new Noise(map.seed);
    this.elevation = [];
    this.moisture = [];
  }

  generate() {
    this._generateElevation();
    this._generateMoisture();
    this._generateTerrainTypes();
    return this.map.terrain;
  }

  _generateElevation() {
    const elevation = [];
    const width = this.map.width;
    const height = this.map.height;
    
    for (let y = 0; y < height; y++) {
      elevation[y] = [];
      for (let x = 0; x < width; x++) {
        // Generate base elevation with multiple octaves
        let e = 0;
        e += this.noise.octavePerlin(x / 200, y / 200, 6, 0.5) * 0.5;
        e += this.noise.octavePerlin(x / 50, y / 50, 4, 0.5) * 0.25;
        e += this.noise.octavePerlin(x / 10, y / 10, 2, 0.5) * 0.25;
        
        // Adjust elevation to create more water
        e = this._adjustElevation(e, x, y, width, height);
        
        elevation[y][x] = e;
      }
    }
    
    this.elevation = elevation;
  }

  _adjustElevation(e, x, y, width, height) {
    // Create more water near edges (optional)
    const edgeFactor = 0.2;
    const edgeX = Math.min(x, width - x) / (width * edgeFactor);
    const edgeY = Math.min(y, height - y) / (height * edgeFactor);
    const edgeEffect = Math.min(edgeX, edgeY);
    
    if (edgeEffect < 1) {
      e = e * edgeEffect - (1 - edgeEffect) * 0.5;
    }
    
    return Math.min(Math.max(e, -1), 1);
  }

  _generateMoisture() {
    const moisture = [];
    for (let y = 0; y < this.map.height; y++) {
      moisture[y] = [];
      for (let x = 0; x < this.map.width; x++) {
        let m = this.noise.octavePerlin(x / 100, y / 100, 4, 0.5);
        m += this.noise.octavePerlin(x / 20, y / 20, 2, 0.5) * 0.5;
        moisture[y][x] = (m + 1) / 2; // Normalize to 0-1
      }
    }
    this.moisture = moisture;
  }

  _generateTerrainTypes() {
    const terrain = [];
    for (let y = 0; y < this.map.height; y++) {
      terrain[y] = [];
      for (let x = 0; x < this.map.width; x++) {
        const e = this.elevation[y][x];
        const m = this.moisture[y][x];
        
        terrain[y][x] = this._determineTerrainType(e, m);
      }
    }
    this.map.terrain = terrain;
  }

  _determineTerrainType(elevation, moisture) {
    if (elevation < 0.1) return 'deep_water';
    if (elevation < 0.2) return 'shallow_water';
    if (elevation < 0.3) return 'sand';
    
    if (elevation > 0.9) {
      if (moisture > 0.6) return 'snow';
      return 'mountain';
    }
    
    if (elevation > 0.7) {
      if (moisture > 0.7) return 'wet_mountain';
      return 'dry_mountain';
    }
    
    if (moisture < 0.3) {
      if (elevation > 0.5) return 'high_desert';
      return 'desert';
    }
    
    if (moisture > 0.7) {
      if (elevation > 0.5) return 'swamp';
      return 'forest';
    }
    
    return 'grassland';
  }
}

module.exports = TerrainGenerator;