var terrain,
    player,
    gamePhase = 0,
    playersState = [0, 0]
    playerTurn = 1,
    lastCX = -1,
    lastCY= -1;



socket.on('sendPieceMoveToRoom', (data) => {
  console.log('Move piece recu : ', data["terrain"], data["AX"], data["AY"], data["BX"], data["BY"]);
  socket.emit("sendPieceMovePlayer", data);
});

socket.on('addPieceToRoom', (data) => {
  console.log('addPiece recu : ', data["terrain"], data["x"], data["y"], data["pieceType"], data["power"], data["player"]);
  socket.emit("addPiecePlayer", data);
});


socket.on('swapPieceMoveToRoom', (data) => {
  console.log('Swap piece recu : ', data["terrain"], data["AX"], data["AY"], data["BX"], data["BY"]);
  socket.emit("swapPieceMovePlayer", data);
});


socket.on("numberPlayer", (data) => {
  console.log("Tu es le joueur : ", data);
  player = data;
});

socket.on("confirmPlacementCheck", (data) => {
  console.log("playersState : ", data);
  playersState = data;
  if(playersState[0] == 1 && playersState[1] == 1){
    console.log("Les deux joueurs sont ok c'est parti");
    gamePhase = 1;
  }
});


socket.on("otherPlayerDisco", () => {
  alert("L'autre joueur à une co de merde désolé");
});

socket.on("nextPlayer", () => {
  if(playerTurn == 1){
    playerTurn = 2;
  }
  else{
  playerTurn = 1
  }
});

socket.on("loading", () => {
  console.log("En attente d'un autre joueur");
});


socket.on("start", () => {
  console.log("Début de la partie");
});

socket.on("getTerr", (terr) => {
  terrain = terr;
  RefreshTer();
  console.log(terrain);
});

socket.on("check", (msg) => {
  console.log(msg);
});


function getTerr() {
  socket.emit("getTerr");
}


function swapePiece(AX, AY, BX, BY) {
  if(gamePhase==0){
    socket.emit("SwapPieceToServer", {"AX" : AX, "AY": AY, "BX": BX, "BY": BY, "player": player});
  }
}


function movePiece(AX, AY, BX, BY) {
  if(gamePhase==1 && player == playerTurn){
    socket.emit("sendPieceMoveToServer", {"AX" : AX, "AY": AY, "BX": BX, "BY": BY, "player": player});
  }
}

function addPiece(x,y, pieceType, power, player) {
  if(gamePhase==-1){
    socket.emit("addPieceToServer", {"terrain": terrain, "x": x, "y": y, "pieceType": pieceType, "power": power, "player":player})
  }
}

$( document ).ready(function() {
    socket.emit("createTerr");

    let tab = document.getElementById("Plateau");
    for(let x = 0; x < 10; x++) {
      for(let y = 0; y < 10; y++) {
        tab.rows[y].cells[x].addEventListener('click',() => {click_event(x, y);} );
      }
    }

    $(".buttonConfirm").click(function() {
      playersState[player-1] = 1;
      socket.emit("confirmPlacement", playersState)
      $(".buttonConfirm").hide();
    })
});

function click_event(x, y){
  if(gamePhase){
    if(gamePhase == player) {
      if(lastCX != -1 && lastCY != -1){
        movePiece(lastCX, lastCY, x, y);
        lastCX = -1;
        lastCY = -1;
        return(0);
      }
      else {
        lastCX = x;
        lastCY = y;
        return(0);
      }
    }
  }
  else {
    if(lastCX != -1 && lastCY != -1){
      SwapPiece(lastCX, lastCY, x, y);
      lastCX = -1;
      lastCY = -1;
      return(0);
    }
    else {
      lastCX = x;
      lastCY = y;
      return(0);
    }
  }
  //PlayTest(x, y);
}


function PlayTest(x, y){
  if(!terrain.matrix[x][y].hasPiece){
    addPiece(x,y, 0, 4, 1);
  }
  console.log("click at X: ", x, " Y: ", y);
  setTimeout(function () {
    let tab = document.getElementById("Plateau");
    for (let i = 0; i < terrain.matrix.length; i++) {
      for (let j = 0; j < terrain.matrix[i].length; j++) {
        //console.log(tab.rows[i].cells[j]);
        if(tab.rows[j].cells[i].firstChild){
          tab.rows[j].cells[i].removeChild(tab.rows[j].cells[i].firstChild);
        }

        if (terrain.matrix[i][j].hasPiece){
          //console.log("got Piece");
          let pieceImg = document.createElement('img');
          tab.rows[j].cells[i].appendChild(pieceImg);
          pieceImg.class="SpongeBobTester";
          pieceImg.src="./img/SpongeBobTester.png";
        }
      }
    }
  }, 25)
}

function RefreshTer() {
  let tab = document.getElementById("Plateau");
  for (let i = 0; i < terrain.matrix.length; i++) {
    for (let j = 0; j < terrain.matrix[i].length; j++) {
      //console.log(tab.rows[i].cells[j]);
      if(tab.rows[j].cells[i].firstChild){
        tab.rows[j].cells[i].removeChild(tab.rows[j].cells[i].firstChild);
      }

      if (terrain.matrix[i][j].hasPiece){
        //console.log("got Piece");
        let pieceImg = document.createElement('img');
        tab.rows[j].cells[i].appendChild(pieceImg);
        switch (terrain.matrix[i][j].pieceType) {
          case 6:
            pieceImg.class="SpongeBobTester";
            pieceImg.src="./img/SpongeBobTester.png";
            break;
          case 5:
            pieceImg.class="SpongeBobTester";
            pieceImg.src="./img/SpongeBobTester.png";
            break;
          case 4:
            pieceImg.class="SpongeBobTester";
            pieceImg.src="./img/SpongeBobTester.png";
            break;
          case 3:
            pieceImg.class="SpongeBobTester";
            pieceImg.src="./img/SpongeBobTester.png";
              break;
          case 2:
            pieceImg.class="SpongeBobTester";
            pieceImg.src="./img/SpongeBobTester.png";
            break;
          case 1:
            pieceImg.class="SpongeBobTester";
            pieceImg.src="./img/SpongeBobTester.png";
            break;
          case 0:
            pieceImg.class="SpongeBobTester";
            pieceImg.src="./img/SpongeBobTester.png";
            break;
          default:
            pieceImg.class="SpongeBobTester";
            pieceImg.src="./img/SpongeBobTester.png";
            break;
        }
      }
    }
  }
}
