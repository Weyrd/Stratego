import Piece from './Piece.js'
import Case from './Case.js'
import Terrain from './Terrain.js'


let test = new Terrain(4, 3);
test.matrix[1][2].transformToWater()
console.log(test);
//document.write("test");
