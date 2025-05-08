const Alea = require('seedrandom');

class Noise {
  constructor(seed) {
    this.rng = new Alea(seed);
    this.gradients = {};
    this.permutation = this._buildPermutation();
  }

  _buildPermutation() {
    const p = new Array(512);
    for (let i = 0; i < 256; i++) {
      p[i] = i;
    }
    for (let i = 0; i < 256; i++) {
      const j = Math.floor(this.rng() * 256);
      [p[i], p[j]] = [p[j], p[i]];
    }
    for (let i = 0; i < 256; i++) {
      p[i + 256] = p[i];
    }
    return p;
  }

  _gradient(hash, x, y) {
    const h = hash & 15;
    const grad = 1 + (h & 7);
    return ((h & 8) ? -x : x) * grad + ((h & 4) ? -y : y) * grad;
  }

  fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  lerp(a, b, t) {
    return a + t * (b - a);
  }

  perlin(x, y) {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    const u = this.fade(x);
    const v = this.fade(y);
    const A = this.permutation[X] + Y;
    const B = this.permutation[X + 1] + Y;

    return this.lerp(
      this.lerp(
        this._gradient(this.permutation[A], x, y),
        this._gradient(this.permutation[B], x - 1, y),
        u
      ),
      this.lerp(
        this._gradient(this.permutation[A + 1], x, y - 1),
        this._gradient(this.permutation[B + 1], x - 1, y - 1),
        u
      ),
      v
    );
  }

  octavePerlin(x, y, octaves, persistence) {
    let total = 0;
    let frequency = 1;
    let amplitude = 1;
    let maxValue = 0;

    for (let i = 0; i < octaves; i++) {
      total += this.perlin(x * frequency, y * frequency) * amplitude;
      maxValue += amplitude;
      amplitude *= persistence;
      frequency *= 2;
    }

    return total / maxValue;
  }
}

module.exports = Noise;