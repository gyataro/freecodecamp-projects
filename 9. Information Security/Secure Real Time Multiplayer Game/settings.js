const gameSettings = {
  canvasWidth: 640,
  canvasHeight: 480, 

  playerWidth: 25,
  playerHeight: 25,
  playerSpeed: 5,
  playerColour: '#D81E5B',
  otherColour: '#EB5E55',

  coinWidth: 10,
  coinColour: '#FDF0D5',
  coinValue: 2
}

try {
  module.exports = gameSettings;
} catch(e) {}