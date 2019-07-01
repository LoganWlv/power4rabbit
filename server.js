/* eslint-disable no-unused-vars */
/* eslint-disable new-cap */
const express = require('express');
// const app = express();
const port = process.env.PORT || 9090;
console.log('Using PORT: ' + port);
// const bodyParser = require('body-parser');
const router = express.Router();
// const tokyo = require('./routes/tokyo')(router);

const http = require('https');
const fs = require('fs');
const url = require('url');

const server = http.createServer(function(req, res) {
  const request = url.parse(req.url, true);
  const action = request.pathname;
  if (action === '/kingRabbit.png') {
    const img = fs.readFileSync('./assets/kingRabbit.png');
    res.writeHead(200, {'Content-Type': 'image/png'});
    res.end(img, 'binary');
  } else if (action === '/power4Board.png') {
    const img = fs.readFileSync('./assets/power4Board.png');
    res.writeHead(200, {'Content-Type': 'image/png'});
    res.end(img, 'binary');
  } else {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(content);
    });
  }
});

const io = require('socket.io').listen(server);

let users = [];

io.sockets.on('connection', function(socket) {
  console.log('Un client est connecté');

  socket.on('new-user', function(username) {
    console.log('Welcome to KING RABBIT POWER4 ' + username);
    if (users.length < 2 ) {
      users.push(username);
      if (users.length == 1) {
        socket.emit('waiting_player', 'Waiting for an other player');
      }
      if (users.length == 2) {
        console.log('starting game');
        socket.broadcast.emit('start_game', users);
        socket.emit('start_game', users);
      }
    } else {
      socket.emit('game_going_on', 'Wait for the game to be over');
    }
    console.log({users});
  });

  socket.on('playable-piece-event', function(circleCoord) {
    socket.broadcast.emit('opponent-move', circleCoord);
  });

  socket.on('drop-piece-event', function(circleCoord) {
    socket.broadcast.emit('opponent-move', circleCoord);
  });

  socket.on('change-player-turn', function(message) {
    socket.broadcast.emit('change-turn', 'Change player turn');
  });

  socket.on('game_finished', function(winner) {
    socket.broadcast.emit('game-over', winner);
  });


  socket.on('clear-users', function(username) {
    users = [];
  });
});

server.listen(port);

// app.use(bodyParser.json());
/*
app.use('/', tokyo);


app.get('*', (req, res) => {
  console.log(req.body);
  res.send('tata');
});

app.listen(port, () => {
  console.log('listening on 9090');
});
*/
