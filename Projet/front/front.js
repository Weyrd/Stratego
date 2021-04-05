var terrain;
socket.on('sendPieceMoveToRoom', (data) => {
  console.log('Move piece recu : ', data["terrain"], data["AX"], data["AY"], data["BX"], data["BY"]);
  socket.emit("sendPieceMovePlayer", data);
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

socket.on("getInterView", (InterView) => {
  console.log(InterView);
});


function getTerr() {
  socket.emit("getTerr");
}


function movePiece(AX, AY, BX, BY) {
  socket.emit("sendPieceMoveToServer", {"AX" : AX, "AY": AY, "BX": BX, "BY": BY});

}


$( document ).ready(function() {
    socket.emit("createTerr");
});


let tab = document.getElementById("Plateau");
for(let x = 0; x < 10; x++) {
  for(let y = 0; y < 10; y++) {
    tab.rows[x].cells[y].addEventListener('click',() => {click_event(x, y);} );
  }
}

click_event(x, y){
  console.log("test");
  PlayTest(x, y);
}

PlayTest(x, y){
  let tab = document.getElementById("Plateau");
  if(!game.matrix[x][y].hasPiece){
    game.matrix[x][y].addPiece(0, 4, 1);
  }
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      tab.rows[i].cells[j].removeChild(tab.rows[i].cells[j].firstChild);
      if (game.matrix[i][j].hasPiece){
        let pieceImg = document.createElement('img');
        tab.rows[i].cells[j].appendChild(pieceImg);
        pieceImg.class="SpongeBobTester";
        pieceImg.src="./img/SpongeBobTester.png";
      }
    }
  }
}
