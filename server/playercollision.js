let Vector = require( __dirname + '/vector.js');

class PlayerCollider {
	constructor() {
		this.playerPositions = [];
	}

	add(playerPositions) {
		this.playerPositions.push(playerPositions);
	}

	checkBoundaries(point, ballID) {
		for (let player of this.playerPositions) {
			if (point.x >= player.left && point.x <= player.right &&
				point.y <= player.bottom && point.y >= player.top && ballID !== player.id) {
				return true;
			}
		}
		return false;
	}

	checkCollision(ball) {
		let topLeft = new Vector(ball.pos.x, ball.pos.y);
		let bottomLeft = new Vector(ball.pos.x, ball.pos.y + ball.size.y);
		let topRight = new Vector(ball.pos.x + ball.size.x, ball.pos.y);
		let bottomRight = new Vector(ball.pos.x + ball.size.x, ball.pos.y + ball.size.y);

		if (this.checkBoundaries(topLeft, ball.playerID) || this.checkBoundaries(bottomLeft, ball.playerID) ||
			this.checkBoundaries(topRight, ball.playerID) || this.checkBoundaries(bottomRight, ball.playerID)) {
			ball.stop();
		}
	}
}

module.exports = PlayerCollider;