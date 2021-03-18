/**** Import npm libs ****/

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
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

//const states = require('./back/modules/states');

/**** Project configuration ****/

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

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

/**** Code ****/

app.get('/', (req, res) => {
//  states.printServerStatus();
  res.sendFile(__dirname + '/front/testground.html');
});

app.get('/game', (req, res) => {
    res.sendFile(__dirname + '/front/html/game.html');
});


app.post('/login', body('login').isLength({ min: 3 }).trim().escape(), (req, res) => {
  const login = req.body.login

  // Error management
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    //return res.status(400).json({ errors: errors.array() });
  } else {
    // Store login
    req.session.username = login;
    req.session.save()
    res.redirect('/');
  }
});

function matchmacking(socket) {
  if(socket.rooms.size == 1) {
    joinRoom = false;
    // check if one room already exist with one player
    for (const [key, value] of io.sockets.adapter.rooms) {
      if(key.includes("roomId-")){
        if(value.size == 1){
          roomId = key;
          socket.join(roomId)
          joinRoom = true;
          break;
        }
      }
    }
    // else create new room
      if(!joinRoom){
        roomId = "roomId-" + currentroomId;
        socket.join(roomId);
        currentroomId++;
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
  //io.emit('new-message', 'Utilisateur ' + socket.handshake.session.username + ' vient de se connecter');


    /*socket.on("login", () => {
      let srvSockets = io.sockets.sockets;
      srvSockets.forEach(user => {
        console.log(user.handshake.session.username);
      });
      io.emit('new-message', 'Utilisateur ' + socket.handshake.session.username + ' vient de se connecter');
    });*/

    socket.on('message', (msg) => {
      console.log('message: ' + msg);
      io.emit('new-message', socket.handshake.session.username + ' : ' + msg);
    });

    socket.on('sendPieceMove', (data) => {
      console.log('Move piece : ' + data);
      io.to(socket.handshake.session.roomId).emit('sendPieceMoveToRoom', data);
      //io.to(socket.handshake.session.roomId).emit('checkSend', "good");
      console.log(io.sockets.adapter.rooms.get(socket.handshake.session.roomId));
    });

  socket.on('disconnect', () => {
    io.emit('new-message', 'Serveur : Utilisateur ' + socket.handshake.session.username + ' vient de se déconnecter');
    console.log('Un Utilisateur s\'est déconnecté');
  });
});

http.listen(258, () => {
  console.log('Serveur lancé sur le port 258');
});
