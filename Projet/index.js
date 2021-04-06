/**** Import npm libs ****/
const mysql = require('mysql');
const back = require('./back');
const user = require('./back/user')
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const session = require("express-session")({

  secret: "1081a1e0c1b22b5f6a71401884e29e20228fa72021f425b7687125af0c467d06",
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 2 * 60 * 60 * 1000,
    secure: false
  }
});
const sharedsession = require("express-socket.io-session");
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');

var currentroomId = 0;
/**** Import project libs ****/
const {Terrain} = require("./back/Class.js")



/**** Project configuration ****/

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.set('views', __dirname + '/front/html-js');
app.set('view engine', 'ejs');

// Init of express, to point our assets
app.use(express.static(__dirname + '/front/'));
app.use(urlencodedParser);
app.use(session);

// Configure socket io with session middleware
io.use(sharedsession(session, {
  // Session automatiquement sauvegardée en cas de modification
  autoSave: true
}));

// Détection de si nous sommes en production, pour sécuriser en https
if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  session.cookie.secure = true // serve secure cookies
}

/**** route ****/

app.get('/game', (req, res) => {
  res.sendFile(__dirname + '/front/jeu.html');
});

app.get('/', (req, res) => { //REDIRECTION PAR DEFAUT
  res.render(__dirname + '/front/html-js/menu.ejs');
});

app.get('/signup', user.signup);//call for signup page
app.post('/signup', user.signup);
app.get('/login', back.index);//call for login page
app.post('/login', user.login);//call for login post
app.get('/', back.index);



function findClientsSocketByRoomId(roomId) {
var res = []
, room = io.sockets.adapter.rooms[roomId];
if (room) {
    for (var id in room) {
    res.push(io.sockets.adapter.nsp.connected[id]);
    }
}
return res;
}


function matchmacking(socket) {
  if(socket.rooms.size == 1) {
    joinRoom = false;
    // check if one room already exist with one player
    for (const [key, value] of io.sockets.adapter.rooms) {
      if(key.includes("roomId-")){
        if(value.size == 1){
          roomId = key;
          socket.join(roomId)
          socket.emit("numberPlayer", 2)
          joinRoom = true;
          break;
        }
      }
    }
    // else create new room
      if(!joinRoom){
        roomId = "roomId-" + currentroomId;
        socket.join(roomId);
        socket.emit("numberPlayer", 1)
        currentroomId++;
        io.in(roomId).emit("loading");
      }
  }
  io.to(socket).emit("postRoom", roomId)
  socket.handshake.session.roomId = roomId;
  socket.handshake.session.save()

  if(io.sockets.adapter.rooms.get(roomId).size == 2){
    io.in(roomId).emit("start");
    console.log("A new Stratego is born (", roomId, ")");
  }
}

io.on('connection', (socket) => {
  console.log('Un Utilisateur s\'est connecté\n');
  matchmacking(socket)

    socket.on("createTerr", () => {
      socket.handshake.session.terr = new Terrain(10, 10);
      socket.handshake.session.terr.generateVanillaLake();
      socket.handshake.session.terr.RandomPiecePlacing();
      socket.handshake.session.save()
      socket.emit("getTerr", socket.handshake.session.terr);
    });

    socket.on("getOtherPlayerTerr", (player) => {
      console.log("J2 try de get l'autre matrix");
      io.to(socket.handshake.session.roomId).emit("getOtherPlayerTerr", player);
    });


    socket.on("postTerr", (matrix) => {
      console.log("post matrix");
      socket.handshake.session.terr.matrix = matrix;
      socket.handshake.session.save()
      socket.emit("getTerr", socket.handshake.session.terr);
    });

    socket.on("transitTerr", (terr) => {
      console.log("matrice qui transite omg");
      io.to(socket.handshake.session.roomId).emit("getTransitTerr", socket.handshake.session.terr);
    });

    socket.on("getTerr", (terr) => {
      socket.emit("getTerr",   socket.handshake.session.terr);
    });

    socket.on("confirmPlacement", (player) => {
      //console.log(player);
      io.in(socket.handshake.session.roomId).emit('confirmPlacementCheck', player);
    });



    socket.on('addPieceToServer', (data) => {
      console.log('Addpiece sur le serveur : ',  data["x"], data["y"], data["pieceType"], data["power"], data["player"]);
      data["terrain"] =   socket.handshake.session.terr;
      io.to(socket.handshake.session.roomId).emit('addPieceToRoom', data);
      socket.handshake.session.save()
    });

    socket.on('addPiecePlayer', (data) => {
      console.log(socket.id, ' -> addpiece  : ',  data["x"], data["y"], data["pieceType"], data["power"], data["player"]);
      if(typeof socket.handshake.session.terr !== "undefined"){
        err =  socket.handshake.session.terr.matrix[data["x"]][data["y"]].addPiece(data["pieceType"], data["power"], data["player"]);

        io.in(socket.handshake.session.roomId).emit('check', err);
        socket.handshake.session.save()
        socket.emit("getTerr", socket.handshake.session.terr);
      }
    });



    socket.on('sendPieceMoveToServer', (data) => {
      console.log('Coup reçu sur le serveur : ',  data["AX"], data["AY"], data["BX"], data["BY"], data["player"]);
      data["terrain"] =  socket.handshake.session.terr;

      io.to(socket.handshake.session.roomId).emit('sendPieceMoveToRoom', data);
      socket.handshake.session.save()
    });


    socket.on('sendPieceMovePlayer', (data) => {
      console.log(socket.id, ' -> move piece : ',  data["AX"], data["AY"], data["BX"], data["BY"], data["player"]);
      err = socket.handshake.session.terr.MovePieceTo(socket.handshake.session.terr, data["AX"], data["AY"], data["BX"], data["BY"], data["player"]);

      socket.handshake.session.save()
      if(err == 0 || err == 1 || err == 2){
          socket.emit('nextPlayer');
      }
      else if(err==3){
          io.in(socket.handshake.session.roomId).emit('win')
      }
      else{
      }
      io.in(socket.handshake.session.roomId).emit('check', err);
      socket.emit("getTerr", socket.handshake.session.terr);
    });


    /////
    socket.on('SwapPieceToServer', (data) => {
      console.log('Swap reçu sur le serveur : ',  data["AX"], data["AY"], data["BX"], data["BY"], data["player"]);
      data["terrain"] =  socket.handshake.session.terr;

      io.to(socket.handshake.session.roomId).emit('swapPieceMoveToRoom', data);
      socket.handshake.session.save()
    });


    socket.on('swapPieceMovePlayer', (data) => {
      console.log(socket.id, ' -> swap piece : ',  data["AX"], data["AY"], data["BX"], data["BY"], data["player"]);
      //console.log(socket.handshake.session.terr);
      err = socket.handshake.session.terr.SwapPiece(socket.handshake.session.terr, data["AX"], data["AY"], data["BX"], data["BY"], data["player"]);

      io.in(socket.handshake.session.roomId).emit('check', err);
      socket.handshake.session.save()
      socket.emit("getTerr", socket.handshake.session.terr);
    });


  socket.on('disconnect', () => {
    io.in(socket.handshake.session.roomId).emit('otherPlayerDisco');
    console.log('Un Utilisateur s\'est déconnecté');
  });
});

http.listen(258, () => {
  console.log('Serveur lancé sur le port 258');
});


app.use(express.static('front/html-js'));
app.use(express.static('front/css'));



var conn = mysql.createConnection({
  host: 'localhost',
  user: 'wyrd',
  password: '666',
  database: 'users'
});

conn.connect(function(err) {
  if (err) throw err;
  console.log('Database is connected successfully !');
});
global.db = conn;
//module.exports = conn;
