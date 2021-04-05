var terrain;
socket.on('sendPieceMoveToRoom', (data) => {
  console.log('Move piece recu : ', data["terrain"], data["AX"], data["AY"], data["BX"], data["BY"]);
  socket.emit("sendPieceMovePlayer", data);
});

socket.on('addPieceToRoom', (data) => {
  console.log('addPiece recu : ', data["terrain"], data["x"], data["y"], data["pieceType"], data["power"], data["player"]);
  socket.emit("addPiecePlayer", data);
});


socket.on("loading", () => {
  console.log("En attente d'un autre joueur");
});


socket.on("start", () => {
  console.log("Début de la partie");
});

socket.on("getTerr", (terr) => {
  terrain = terr;
  console.log(terrain);
});

socket.on("check", (msg) => {
  console.log(msg);
});



function getTerr() {
  socket.emit("getTerr");
}


function movePiece(AX, AY, BX, BY) {
  socket.emit("sendPieceMoveToServer", {"AX" : AX, "AY": AY, "BX": BX, "BY": BY});

}

function addPiece(x,y, pieceType, power, player) {
  console.log("test");
  socket.emit("addPieceToServer", {"terrain": terrain, "x": x, "y": y, "pieceType": pieceType, "power": power, "player":player})
}

$( document ).ready(function() {
    socket.emit("createTerr");

    let tab = document.getElementById("Plateau");
    for(let x = 0; x < 10; x++) {
      for(let y = 0; y < 10; y++) {
        tab.rows[x].cells[y].addEventListener('click',() => {click_event(x, y);} );
      }
    }
});



function click_event(x, y){
  PlayTest(x, y);
}


function PlayTest(x, y){
  let tab = document.getElementById("Plateau");
  if(!terrain.matrix[x][y].hasPiece){
    addPiece(x,y, 0, 4, 1);
  }
  for (let i = 0; i < terrain.matrix.length; i++) {
    for (let j = 0; j < terrain.matrix[i].length; j++) {
      tab.rows[i].cells[j].removeChild(tab.rows[i].cells[j].firstChild);
      if (terrain.matrix[i][j].hasPiece){
        let pieceImg = document.createElement('img');
        tab.rows[i].cells[j].appendChild(pieceImg);
        pieceImg.class="SpongeBobTester";
        pieceImg.src="./img/SpongeBobTester.png";
      }
    }
  }
}
