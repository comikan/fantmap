const seedrandom = require('seedrandom');

class NameGenerator {
  constructor(map) {
    this.map = map;
    this.rng = new seedrandom(map.seed);
    this.syllables = {
      start: ['Ar', 'Be', 'Ca', 'De', 'El', 'Fa', 'Ga', 'Ha', 'Il', 'Jo'],
      middle: ['ra', 'ti', 'lo', 'ma', 'ne', 'si', 'vo', 'xu', 'ya', 'ze'],
      end: ['dor', 'land', 'nia', 'ros', 'thar', 'via', 'wyn', 'xar', 'yon', 'zur']
    };
    this.prefixes = ['North', 'South', 'East', 'West', 'New', 'Old', 'Port', 'Fort'];
    this.citySuffixes = ['burg', 'ford', 'haven', 'keep', 'port', 'stead', 'town', 'ville'];
  }

  generateCountryName() {
    const start = this._randomElement(this.syllables.start);
    const middle = this._randomElement(this.syllables.middle);
    const end = this._randomElement(this.syllables.end);
    const suffixes = ['Kingdom', 'Empire', 'Realm', 'Dominion', 'Federation'];
    return `${start}${middle}${end} ${this._randomElement(suffixes)}`;
  }

  generateCityName(countryName) {
    if (this.rng() > 0.3) {
      return `${this._randomElement(this.prefixes)} ${countryName.split(' ')[0]}`;
    }
    const start = this._randomElement(this.syllables.start);
    const middle = this._randomElement(this.syllables.middle);
    return `${start}${middle}${this._randomElement(this.citySuffixes)}`;
  }

  _randomElement(array) {
    return array[Math.floor(this.rng() * array.length)];
  }
}

module.exports = NameGenerator;