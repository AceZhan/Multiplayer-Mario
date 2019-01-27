let Vector = require( __dirname + '/vector.js');

class Fireball {
	constructor(playerID, playerPos, count, playerDirection) {
		this.playerID = playerID;
		this.count = count;
		this.pos = new Vector(playerPos.x, playerPos.y);
		this.vel = new Vector(playerDirection * 3.5, 0);
		this.size = new Vector(8, 8);
		this.direction = playerDirection;
		this.collided = false;
		this.explosionTime = 0;
	}

	updateX() {
		this.pos.x += this.vel.x;
	}

	updateY() {
		this.pos.y += this.vel.y;
	}

	bounce() {
		this.vel.y = -3;
	}

	stop() {
		this.vel.x = 0;
		this.vel.y = 0;
		this.collided = true;
	}

	explode() {
		this.explosionTime += 1;
	}

}

module.exports = Fireball;