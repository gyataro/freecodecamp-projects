import gameSettings from './Settings.mjs';

class Player {
  constructor({ x, y, id, main = false, scoreTime = new Date().getTime() }) {
    this.x = x;
    this.y = y;
    this.id = id;
    this.isMain = main;
    this.scoreTime = scoreTime;
    
    this.score = 0;
    this.dir = {};
  }

  movePlayer(dir, speed = gameSettings.playerSpeed) {
    switch(dir) {
      case 'up':
        this.y - speed >= 0 ? this.y -= speed : this.y = 0;
        break;
      case 'down':
        this.y + speed <= gameSettings.yBoundMax ? this.y += speed : this.y = gameSettings.yBoundMax;
        break;
      case 'left':
        this.x - speed >= 0 ? this.x -= speed : this.x = 0;
        break;
      case 'right':
        this.x + speed <= gameSettings.xBoundMax ? this.x += speed : this.x = gameSettings.xBoundMax;
        break;
      default:
        break;
    }
  }

  draw(context) {
    const currDir = Object.keys(this.dir).filter(dir => this.dir[dir]);
    currDir.forEach(dir => this.movePlayer(dir, gameSettings.playerSpeed));

    context.fillStyle = this.isMain ? gameSettings.playerColour : gameSettings.otherColour;
    context.fillRect(this.x, this.y, gameSettings.playerWidth, gameSettings.playerHeight);
  }

  moveDir(dir) {
    this.dir[dir] = true;
  }

  stopDir(dir) {
    this.dir[dir] = false;
  }

  collision(coin) {
    return !(
      ((coin.y + gameSettings.coinWidth) < (this.y)) ||
      (coin.y > (this.y + gameSettings.playerHeight)) ||
      ((coin.x + gameSettings.coinWidth) < this.x) ||
      (coin.x > (this.x + gameSettings.playerWidth))
    );
  }

  calculateRank(players) {
    let totalRank = players.length;
    let currRank = totalRank;

    players.forEach((player) => {
      if(player.id == this.id){ 
        return;
      } else if(player.score < this.score) {
        currRank -= 1;
      } else if((player.score == this.score) && this.scoreTime > player.scoreTime) {
        currRank -= 1;
      }
    });

    return `Rank: ${currRank}/${totalRank}`;
  }
}

export default Player;
