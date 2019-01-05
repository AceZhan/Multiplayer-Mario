let Vector = require( __dirname + '/vector.js');

class Fireball {
	constructor(playerID, playerPos, count) {
		this.playerID = playerID;
		this.count = count;
		this.pos = new Vector(playerPos.x, playerPos.y);
		this.vel = new Vector(2, 0);
	}

	fireLeft() {
		this.pos.x += this.vel.x;
	}

}

module.exports = Fireball;