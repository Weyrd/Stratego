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
  generateVanillaLake(){
    //first lake
    this.matrix[2][4].transformToWater();
    this.matrix[2][5].transformToWater();

    this.matrix[3][4].transformToWater();
    this.matrix[3][5].transformToWater();

    //second lake
    this.matrix[6][4].transformToWater();
    this.matrix[6][5].transformToWater();

    this.matrix[7][4].transformToWater();
    this.matrix[7][5].transformToWater();
  }
  generateRamdomLake(){} //TODO MAYBE
}
