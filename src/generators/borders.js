const VoronoiGenerator = require('../utils/voronoi');

class BorderGenerator {
  constructor(map) {
    this.map = map;
    this.voronoi = new VoronoiGenerator(map, { 
      pointsCount: 15 + Math.floor(Math.random() * 10),
      relaxation: 3
    });
    this.nameGenerator = new (require('./names'))(map);
  }

  generate() {
    const voronoiDiagram = this.voronoi.generate();
    this.map.countries = voronoiDiagram.features.map((polygon, i) => {
      return {
        id: i,
        name: this.nameGenerator.generateCountryName(),
        polygon: polygon,
        color: this._generateColor(i),
        neighbors: [],
        relations: {}
      };
    });
    
    this._identifyNeighbors();
    return this.map.countries;
  }

  _identifyNeighbors() {
    for (let i = 0; i < this.map.countries.length; i++) {
      for (let j = i + 1; j < this.map.countries.length; j++) {
        if (this._shareBorder(this.map.countries[i], this.map.countries[j])) {
          this.map.countries[i].neighbors.push(j);
          this.map.countries[j].neighbors.push(i);
          
          // Set initial relations
          this.map.countries[i].relations[j] = this._generateRelation();
          this.map.countries[j].relations[i] = this.map.countries[i].relations[j];
        }
      }
    }
  }

  _shareBorder(countryA, countryB) {
    // Simplified check - in a real implementation you'd do proper geometry checking
    const coordsA = countryA.polygon.geometry.coordinates[0];
    const coordsB = countryB.polygon.geometry.coordinates[0];
    
    // Check if any points are close (simplified)
    for (const a of coordsA) {
      for (const b of coordsB) {
        const dx = a[0] - b[0];
        const dy = a[1] - b[1];
        if (Math.sqrt(dx * dx + dy * dy) < 10) {
          return true;
        }
      }
    }
    return false;
  }

  _generateRelation() {
    const r = Math.random();
    if (r < 0.1) return 'ally';
    if (r < 0.3) return 'friendly';
    if (r < 0.6) return 'neutral';
    if (r < 0.9) return 'unfriendly';
    return 'enemy';
  }

  _generateColor(index) {
    const hue = (index * 137.508) % 360; // Golden angle
    return `hsl(${hue}, 70%, 60%)`;
  }
}

module.exports = BorderGenerator;