import gameSettings from './Settings.mjs';

class Collectible {
  constructor({x, y, value, id}) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.id = id;
  }

  draw(context) {
    context.fillStyle = gameSettings.coinColour;
    context.fillRect(this.x, this.y, gameSettings.coinWidth, gameSettings.coinWidth);
  }
}

try {
  module.exports = Collectible;
} catch(e) {}

export default Collectible;
