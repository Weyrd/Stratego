import Piece from './Piece.js'
import Case from './Case.js'
import Terrain from './Terrain.js'


let test = new Terrain(10, 10);
//test.matrix[1][2].transformToWater()
test.generateVanillaLake();
console.log(test);
//document.write("test");
