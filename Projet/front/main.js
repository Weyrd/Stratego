import Piece from './Piece.js'
import Case from './Case.js'
import Terrain from './Terrain.js'


let terr = new Terrain(10, 10);
terr.generateVanillaLake();
console.log(terr);
//document.write("test");


socket.on('sendPieceMoveToRoom', (data) => {
  console.log('Move piece : ', data["terrain"], data["AX"], data["AY"], data["BX"], data["BY"]);
  //test.MovePieceTo(data["terrain"], data["AX"], data["AY"], data["BX"], data["BY"])
});

socket.on("start", () => {
  console.log("Début de la partie");
});
