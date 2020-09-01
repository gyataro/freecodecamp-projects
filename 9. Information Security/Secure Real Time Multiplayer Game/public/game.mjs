import Control from './Control.mjs';
import Collectible from './Collectible.mjs';
import Player from './Player.mjs';
import { initPos, initCanvas } from './Canvas.mjs';

const socket = io();
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d', { alpha: false });

let mainPlayer;
let rank;
let tick;
let gameState = {
  players: [],
  coin: {}
};

socket.on('init', ({ players, coin }) => {

  cancelAnimationFrame(tick);

  // Initialize player data
  var spawnPos = initPos();
  mainPlayer = new Player({
    x: spawnPos.x,
    y: spawnPos.y,
    id: socket.id,
    main: true
  });

  // Setup player controls
  Control(mainPlayer, socket);

  // Initialize current game data
  gameState.coin = new Collectible(coin);
  gameState.players = players.map(x => new Player(x)).concat(mainPlayer);
  rank = mainPlayer.calculateRank(gameState.players);

  socket.emit('new_player', mainPlayer);

  socket.on('new_player', newPlayer => {
    if(!gameState.players.some(player => player.id == newPlayer.id)) {
      gameState.players.push(new Player(newPlayer));
    }

    rank = mainPlayer.calculateRank(gameState.players);
  });

  socket.on('move_player', ({ id, dir, pos }) => {
    const movingPlayer = gameState.players.find(player => player.id === id);

    movingPlayer.moveDir(dir);
    
    // Sync from server
    movingPlayer.x = pos.x;
    movingPlayer.y = pos.y;
  });

  socket.on('stop_player', ({ id, dir, pos }) => {
    const stoppingPlayer = gameState.players.find(player => player.id === id);

    stoppingPlayer.stopDir(dir);

    // Sync from server
    stoppingPlayer.x = pos.x;
    stoppingPlayer.y = pos.y;
  });

  socket.on('destroy_player', playerId => {
    gameState.players = gameState.players.filter(player => player.id !== playerId);
    
    rank = mainPlayer.calculateRank(gameState.players);
  });

  socket.on('new_coin', newCoin => {
    gameState.coin = new Collectible(newCoin);
  });

  socket.on('update_player', ({ id, coinId, score }) => {
    const rewardPlayer = gameState.players.find(player => player.id === id);

    rewardPlayer.score = score;
    rewardPlayer.scoreTime = coinId;

    rank = mainPlayer.calculateRank(gameState.players);
  });

  render();
});

const render = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);

  gameState.coin.draw(context);

  gameState.players.forEach(player => {
    player.draw(context);

    if(player.collision(gameState.coin)) {
      socket.emit('destroy_coin', gameState.coin.id);
    }
  });

  context.font = "bold 24px Arial";
  context.fillStyle = '#ffffff'
  context.fillText(rank, 500, 50);

  tick = requestAnimationFrame(render);
}

