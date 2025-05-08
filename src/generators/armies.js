class ArmyGenerator {
    constructor(map) {
      this.map = map;
      this.rng = new (require('seedrandom'))(map.seed);
    }
  
    generate() {
      this.map.armies = [];
      this.map.countries.forEach((country, countryId) => {
        const armyCount = 1 + Math.floor(this.rng() * 3);
        
        for (let i = 0; i < armyCount; i++) {
          const position = this._findArmyPosition(country);
          this.map.armies.push({
            id: `${countryId}-${i}`,
            countryId,
            position,
            size: 1000 + Math.floor(this.rng() * 9000),
            type: this._getArmyType(country)
          });
        }
      });
      return this.map.armies;
    }
  
    _findArmyPosition(country) {
      const polygon = country.polygon.geometry.coordinates[0];
      const points = polygon.slice(0, -1); // Exclude closing point
      
      // Find a point inside the polygon (simplified)
      const center = points.reduce((acc, point) => {
        return [acc[0] + point[0] / points.length, acc[1] + point[1] / points.length];
      }, [0, 0]);
      
      // Add some randomness
      return [
        center[0] + (this.rng() - 0.5) * 20,
        center[1] + (this.rng() - 0.5) * 20
      ];
    }
  
    _getArmyType(country) {
      const types = ['infantry', 'cavalry', 'archers', 'knights', 'siege'];
      return types[Math.floor(this.rng() * types.length)];
    }
  }
  
  module.exports = ArmyGenerator;