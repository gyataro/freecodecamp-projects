import gameSettings from './Settings.mjs';

const initCanvas = (canvas) => {
  canvas.width = gameSettings.canvasWidth;
  canvas.height = gameSettings.canvasHeight;
}

const initPos = () => {
  var pos = {
    x: Math.floor(Math.random() * (gameSettings.canvasWidth - gameSettings.playerWidth)) + gameSettings.playerWidth,
    y: Math.floor(Math.random() * (gameSettings.canvasHeight - gameSettings.playerHeight)) + gameSettings.playerHeight
  }

  return pos;
}

export {
  initCanvas,
  initPos
}