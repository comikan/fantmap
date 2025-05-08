const { createCanvas } = require('canvas');

class Renderer {
  constructor(map) {
    this.map = map;
    this.canvas = createCanvas(map.width, map.height);
    this.ctx = this.canvas.getContext('2d');
    this.terrainColors = {
      deep_water: '#0a2463',
      shallow_water: '#3e92cc',
      sand: '#f4d35e',
      grassland: '#7cb518',
      forest: '#2d5e2d',
      desert: '#e2c044',
      high_desert: '#c19a6b',
      mountain: '#7a7a7a',
      wet_mountain: '#5a7d5a',
      dry_mountain: '#8b7d7b',
      snow: '#ffffff',
      swamp: '#5f9b5f'
    };
  }

  render() {
    this._drawTerrain();
    this._drawBorders();
    this._drawCities();
    this._drawArmies();
    this._drawLandmarks();
    return this.canvas;
  }

  _drawTerrain() {
    for (let y = 0; y < this.map.height; y++) {
      for (let x = 0; x < this.map.width; x++) {
        const terrainType = this.map.terrain[y][x];
        this.ctx.fillStyle = this.terrainColors[terrainType] || '#000000';
        this.ctx.fillRect(x, y, 1, 1);
      }
    }
  }

  _drawBorders() {
    this.map.countries.forEach(country => {
      const coords = country.polygon.geometry.coordinates[0];
      this.ctx.strokeStyle = country.color;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(coords[0][0], coords[0][1]);
      for (let i = 1; i < coords.length; i++) {
        this.ctx.lineTo(coords[i][0], coords[i][1]);
      }
      this.ctx.closePath();
      this.ctx.stroke();
      
      const center = this._getPolygonCenter(coords);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = 'bold 16px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(country.name, center[0], center[1]);
    });
  }

  _drawCities() {
    this.map.cities.forEach(city => {
      const radius = city.size === 'large' ? 5 : city.size === 'medium' ? 3 : 2;
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(city.position[0], city.position[1], radius, 0, Math.PI * 2);
      this.ctx.fill();
      
      if (city.size === 'large') {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '10px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(city.name, city.position[0], city.position[1] + 15);
      }
    });
  }

  _drawArmies() {
    this.map.armies.forEach(army => {
      const country = this.map.countries[army.countryId];
      this.ctx.fillStyle = country.color;
      this.ctx.beginPath();
      this.ctx.arc(army.position[0], army.position[1], 3 + Math.log10(army.size), 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  _drawLandmarks() {
    this.map.landmarks.forEach(landmark => {
      this.ctx.fillStyle = '#ff0000';
      this.ctx.beginPath();
      this.ctx.arc(landmark.position[0], landmark.position[1], 4, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  _getPolygonCenter(polygon) {
    let x = 0, y = 0;
    for (let i = 0; i < polygon.length - 1; i++) {
      x += polygon[i][0];
      y += polygon[i][1];
    }
    return [x / (polygon.length - 1), y / (polygon.length - 1)];
  }
}

module.exports = Renderer;