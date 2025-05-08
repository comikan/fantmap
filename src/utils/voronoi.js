const { point, featureCollection, voronoi } = require('@turf/turf');

class VoronoiGenerator {
  constructor(map, options = {}) {
    this.map = map;
    this.pointsCount = options.pointsCount || 30;
    this.relaxation = options.relaxation || 3;
  }

  generatePoints() {
    const points = [];
    for (let i = 0; i < this.pointsCount; i++) {
      points.push(point([
        Math.random() * this.map.width,
        Math.random() * this.map.height
      ]));
    }
    return featureCollection(points);
  }

  generate() {
    let points = this.generatePoints();
    
    // Lloyd relaxation
    for (let i = 0; i < this.relaxation; i++) {
      const voronoiPolygons = voronoi(points, { bbox: [0, 0, this.map.width, this.map.height] });
      const newPoints = [];
      voronoiPolygons.features.forEach(polygon => {
        const centroid = this._calculateCentroid(polygon);
        newPoints.push(point(centroid));
      });
      points = featureCollection(newPoints);
    }
    
    return voronoi(points, { bbox: [0, 0, this.map.width, this.map.height] });
  }

  _calculateCentroid(polygon) {
    let x = 0, y = 0;
    const coords = polygon.geometry.coordinates[0];
    for (let i = 0; i < coords.length - 1; i++) {
      x += coords[i][0];
      y += coords[i][1];
    }
    return [x / (coords.length - 1), y / (coords.length - 1)];
  }
}

module.exports = VoronoiGenerator;