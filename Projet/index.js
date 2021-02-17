/**** Import npm libs ****/

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const session = require("express-session")({
  // CIR2-chat encode in sha256
  secret: "eb8fcc253281389225b4f7872f2336918ddc7f689e1fc41b64d5c4f378cdc438",
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
const fs = require('fs');
const mysql = require('mysql');

/**** Import project libs ****/

const states = require('./back/modules/states');
const Theoden = require('./back/models/Theoden');

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

// Initialisation de la connexion à la bdd
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "cir2rest"
});

/**** Code ****/

// Block d'accès à la BDD
con.connect(err => {
  if (err) throw err;
  else console.log('Connexion effectuée');
});

// Lecture de fichiers
fs.readFile(__dirname + '/back/data/characters.json', (err, data) => {
  if (err) throw err;
  const characters = JSON.parse(data);
  console.log(characters.characters[0]);
  console.log(characters.characters[0].weapon)
});

/*
//Creation de fichier 
let sentence = "Indubitablement, on dit Pain au chocolat.";
fs.writeFile(__dirname + '/back/data/truth.txt', sentence, (err) => {
  if (err) throw err;
  console.log('Data written to file');
});

// Ajout dans un fichier
let conclusion = "Pour les toulousains, un pain aux amandes est donc une amandine.";
fs.appendFile(__dirname + '/back/data/truth.txt', conclusion, (err) => {
  if (err) throw err;
  console.log('Data added to file');
});
*/

// Ajout dans un fichier JSON
fs.readFile(__dirname + '/back/data/characters.json', (err, data) => {
  if (err) throw err;
  const characters = JSON.parse(data);

  let newCharacter = {
    "name": "Darth Vader",
    "age": 50,
    "gender": "Male",
    "job": "Sith Lord",
    "weapon": [
      "lightsaber",
      "force"
    ]
  };

  characters.characters.push(newCharacter);

  let mydatas = JSON.stringify(characters, null, 2); // Le 2 est pour réguler les espaces dans la chaine finale

  fs.writeFile(__dirname + '/back/data/characters.json', mydatas, (err) => {
    if (err) throw err;
    console.log('Data written to file');
  });

});



/*
let sql = "INSERT INTO components (idComp, name, needRecipe, price, type, buyInBulk, percentUsed) VALUES (0, 'Farine', 1, 1.50, 'food', 1, 0.10)";
  con.query(sql, (err, result) => {
    if (err) throw err;
    console.log("One component inserted");
    console.log(result);
  });

  con.query("SELECT * FROM components", (err, result) => {
    if (err) throw err;
    console.log(result);
  });

  con.query("SELECT * FROM components WHERE idComp = '0'", (err, result) => {
    if (err) throw err;
    console.log(result);
  });

  let sql = "INSERT INTO components (name, needRecipe, price, type, buyInBulk, percentUsed) VALUES ('Sucre', 1, 2, 'food', 1, 0.10)";
  con.query(sql, (err, result) => {
    if (err) throw err;
    console.log("One component inserted");
    console.log(result);
  });

  con.query("SELECT * FROM components ORDER BY idComp", (err, result) => {
    if (err) throw err;
    console.log(result);
  });

  sql = "UPDATE components SET name = 'Sucre en poudre' WHERE idComp = '2'";
  con.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result.affectedRows + " record(s) updated");
  });

  sql = "DELETE FROM components WHERE idComp = '1'";
  con.query(sql, (err, result) => {
    if (err) throw err;
    console.log("Number of records deleted: " + result.affectedRows);
  });

  let sql = "INSERT INTO components ( name, needRecipe, price, type, buyInBulk, percentUsed) VALUES ( 'Farine', 1, 1.50, 'food', 1, 0.10)";
  con.query(sql, (err, result) => {
    if (err) throw err;
    console.log("One component inserted");
    console.log(result);
  });

  sql = "SELECT * FROM components LIMIT 1";
  con.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
  });

  const component = {
    name: 'Sel',
    needRecipe: '1',
    price: '1',
    type: 'food',
    buyInBulk: '1',
    percentUsed: '0.01'
  },

  sql = "INSERT INTO components SET ?";
  con.query(sql, component, (err, result) => {
    if (err) throw err;
    console.log("1 record inserted");
    console.log(result);
  });
*/


app.get('/', (req, res) => {
  let sessionData = req.session;

  // Test des modules 
  states.printServerStatus();
  states.printProfStatus();
  let test = new Theoden();

  // Si l'utilisateur n'est pas connecté
  if (!sessionData.username) {
    res.sendFile(__dirname + '/front/html/login.html');
  } else {
    res.sendFile(__dirname + '/front/html/index.html');
  }
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

io.on('connection', (socket) => {
  console.log('Un élève s\'est connecté');

  socket.on("login", () => {
    let srvSockets = io.sockets.sockets;
    srvSockets.forEach(user => {
      console.log(user.handshake.session.username);
    });
    io.emit('new-message', 'Utilisateur ' + socket.handshake.session.username + ' vient de se connecter');
  });

  socket.on('message', (msg) => {
    console.log('message: ' + msg);
    //Envoie le message pour tous!
    io.emit('new-message', socket.handshake.session.username + ' : ' + msg);
    //Autre alternative : envoyer le message à tous les autres socket ormis celui qui envoie
    //socket.broadcast.emit('new-message', msg);
  });

  socket.on('disconnect', () => {
    io.emit('new-message', 'Serveur : Utilisateur ' + socket.handshake.session.username + ' vient de se déconnecter');
    console.log('Un élève s\'est déconnecté');
  });
});

http.listen(4200, () => {
  console.log('Serveur lancé sur le port 4200');
});

