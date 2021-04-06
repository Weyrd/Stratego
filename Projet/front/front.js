var terrain,
    player,
    gamePhase = false,
    playersState = [0, 0]
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
  if(gamePhase == 1){
    gamePhase = 2;
  }
  else{
  gamePhase = 1
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


function swapPiece(AX, AY, BX, BY) {
    socket.emit("SwapPieceToServer", {"AX" : AX, "AY": AY, "BX": BX, "BY": BY, "player": player});
}


function movePiece(AX, AY, BX, BY) {
  if(player == gamePhase){
    socket.emit("sendPieceMoveToServer", {"AX" : AX, "AY": AY, "BX": BX, "BY": BY, "player": player});
  }
}

function addPiece(x,y, pieceType, power, player) {
    socket.emit("addPieceToServer", {"terrain": terrain, "x": x, "y": y, "pieceType": pieceType, "power": power, "player":player})
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
      swapPiece(lastCX, lastCY, x, y);
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
          pieceImg.id="SpongeBobTester";
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
        if (terrain.matrix[i][j].Piece.shown == true || terrain.matrix[i][j].Piece.player == player) {
          switch (terrain.matrix[i][j].Piece.player) {
            case 2:
              switch (terrain.matrix[i][j].Piece.pieceType) {
                case 6:
                  pieceImg.id="Piece";
                  pieceImg.src="./img/flag2.png";
                  break;
                case 5:
                  pieceImg.id="Piece";
                  pieceImg.src="./img/bombe2.png";
                  break;
                case 4:
                  pieceImg.id="Piece";
                  pieceImg.src="./img/marshall2.png";
                  break;
                case 3:
                  pieceImg.id="Piece";
                  pieceImg.src="./img/démineur2.png";
                  break;
                case 2:
                  pieceImg.id="Piece";
                  pieceImg.src="./img/éclaireur2.png";
                  break;
                case 1:
                  pieceImg.id="Piece";
                  pieceImg.src="./img/espion2.png";
                  break;
                case 0:
                  switch (terrain.matrix[i][j].Piece.power) {
                    case 4:
                      pieceImg.id="Piece";
                      pieceImg.src="./img/sergeant2.png";
                      break;
                    case 5:
                      pieceImg.id="Piece";
                      pieceImg.src="./img/lieutenant2.png";
                      break;
                    case 6:
                      pieceImg.id="Piece";
                      pieceImg.src="./img/capitaine2.png";
                      break;
                    case 7:
                      pieceImg.id="Piece";
                      pieceImg.src="./img/commendant2.png";
                      break;
                    case 8:
                      pieceImg.id="Piece";
                      pieceImg.src="./img/colonel2.png";
                      break;
                    case 9:
                      pieceImg.id="Piece";
                      pieceImg.src="./img/general2.png";
                      break;
                    default:
                      pieceImg.id="SpongeBobTester";
                      pieceImg.src="./img/SpongeBobTester.png";
                      break;
                  }
                  break;
                default:
                  console.log("Display what type ?")
                  pieceImg.id="SpongeBobTester";
                  pieceImg.src="./img/SpongeBobTester.png";
                  break;
              }
              break;
            case 1:
              switch (terrain.matrix[i][j].Piece.pieceType) {
                case 6:
                  pieceImg.id="Piece";
                  pieceImg.src="./img/flag1.png";
                  break;
                case 5:
                  pieceImg.id="Piece";
                  pieceImg.src="./img/bombe1.png";
                  break;
                case 4:
                  pieceImg.id="Piece";
                  pieceImg.src="./img/marshall1.png";
                  break;
                case 3:
                  pieceImg.id="Piece";
                  pieceImg.src="./img/démineur1.png";
                  break;
                case 2:
                  pieceImg.id="Piece";
                  pieceImg.src="./img/éclaireur1.png";
                  break;
                case 1:
                  pieceImg.id="Piece";
                  pieceImg.src="./img/espion1.png";
                  break;
                case 0:
                  switch (terrain.matrix[i][j].Piece.power) {
                    case 4:
                      pieceImg.id="Piece";
                      pieceImg.src="./img/sergeant1.png";
                      break;
                    case 5:
                      pieceImg.id="Piece";
                      pieceImg.src="./img/lieutenant1.png";
                      break;
                    case 6:
                      pieceImg.id="Piece";
                      pieceImg.src="./img/capitaine1.png";
                      break;
                    case 7:
                      pieceImg.id="Piece";
                      pieceImg.src="./img/commendant1.png";
                      break;
                    case 8:
                      pieceImg.id="Piece";
                      pieceImg.src="./img/colonel1.png";
                      break;
                    case 9:
                      pieceImg.id="Piece";
                      pieceImg.src="./img/general1.png";
                      break;
                    default:
                      pieceImg.id="SpongeBobTester";
                      pieceImg.src="./img/SpongeBobTester.png";
                      break;
                  }
                  break;
                default:
                  pieceImg.id="SpongeBobTester";
                  pieceImg.src="./img/SpongeBobTester.png";
                  break;
              }
              break;
            default:
              pieceImg.id="SpongeBobTester";
              pieceImg.src="./img/SpongeBobTester.png";
              break;
          }
        }
        else {
          switch (terrain.matrix[i][j].Piece.player) {
            case 2:
              pieceImg.id="Piece";
              pieceImg.src="./img/back_2.png";
              break;
            case 1:
              pieceImg.id="Piece";
              pieceImg.src="./img/back_1.png";
              break;
            default:
              pieceImg.id="SpongeBobTester";
              pieceImg.src="./img/SpongeBobTester.png";
              break;
          }
        }
      }
    }
  }
}
