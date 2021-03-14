import Case from './Case.js'

export default class Terrain{
  constructor(size_x, size_y) {
    //this.matrix = new Array(size_x).fill(new Array(size_y).fill(new Case()));
    this.matrix = new Array(size_x);
    for (var x = 0; x < size_x; x++) {
      this.matrix[x] = new Array(size_y);
      for (var y = 0; y < size_y; y++) {
        this.matrix[x][y] = new Case();
      }
    }
  }
  generateVanillaLake(){} //TODO
  generateRamdomLake(){} //TODO MAYBE
}
