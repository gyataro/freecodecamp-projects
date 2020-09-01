require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require("helmet");
const expect = require('chai');
const socketio = require('socket.io');
const nocache = require('nocache');

const gameSettings = require('./settings.js');

const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner.js');

const app = express();

app.use(nocache());
app.use(helmet.noSniff());
app.use(helmet.xssFilter());
app.use(helmet.hidePoweredBy({ setTo: 'PHP 7.4.3' }));

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/assets', express.static(process.cwd() + '/assets'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  }); 

//For FCC testing purposes
fccTestingRoutes(app);
    
// 404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

const portNum = process.env.PORT || 3000;

// Server setup FCC testing
const server = app.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log('Tests are not valid:');
        console.error(error);
      }
    }, 1500);
  }
});

// Run socket.io in given http server instance
const io = socketio.listen(server);

const gameState = {
  players: [],
  coin: {
    x: Math.floor(Math.random() * (gameSettings.canvasWidth - gameSettings.coinWidth)),
    y: Math.floor(Math.random() * (gameSettings.canvasHeight - gameSettings.coinWidth)),
    id: new Date().getUTCMilliseconds(),
    value: gameSettings.coinValue
  }
}

io.on('connection', (socket) => {

  socket.emit('init', gameState);
  
  socket.on('disconnect', () => {
    gameState.players = gameState.players.filter(player => player.id !== socket.id);
    socket.broadcast.emit('destroy_player', socket.id);
  });

  socket.on('new_player', (newPlayer) => {
    newPlayer.isMain = false;
    gameState.players.push(newPlayer);
    socket.broadcast.emit('new_player', newPlayer);
  });

  socket.on('move_player', (i_dir, i_pos) => {
    socket.broadcast.emit('move_player', { id: socket.id, dir: i_dir, pos: i_pos });
  });

  socket.on('stop_player', (i_dir, i_pos) => {
    socket.broadcast.emit('stop_player', { id: socket.id, dir: i_dir, pos: i_pos });
  });

  socket.on('destroy_coin', (id) => {
    if(gameState.coin.id == id) {
      const rewardPlayer = gameState.players.find(player => player.id === socket.id);
      rewardPlayer.score += gameSettings.coinValue;

      gameState.coin.x = Math.floor(Math.random() * (gameSettings.canvasWidth - gameSettings.coinWidth));
      gameState.coin.y = Math.floor(Math.random() * (gameSettings.canvasHeight - gameSettings.coinWidth));
      gameState.coin.id = new Date().getUTCMilliseconds();

      io.emit('new_coin', gameState.coin);
      io.emit('update_player', { id: socket.id, coinId: new Date().getTime(), score: rewardPlayer.score });
    }
  });
});

module.exports = app; // For testing
