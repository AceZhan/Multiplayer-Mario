let Vector = require( __dirname + '/vector.js');

class Fireball {
	constructor(playerID, playerPos, count, playerDirection) {
		this.playerID = playerID;
		this.count = count;
		this.pos = new Vector(playerPos.x, playerPos.y);
		this.vel = new Vector(playerDirection * 3.5, 0);
		this.size = new Vector(8, 8);
		this.direction = playerDirection;
	}

	fire() {
		this.pos.x += this.vel.x;
	}

}

module.exports = Fireball;