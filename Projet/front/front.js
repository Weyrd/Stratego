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
