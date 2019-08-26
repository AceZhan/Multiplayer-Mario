let Vector = require( __dirname + '/vector.js');

class PlayerCollider {
	constructor() {
		this.playerPositions = [];
	}

	add(playerPositions) {
		this.playerPositions.push(playerPositions);
	}

	checkBoundaries(point, ball) {
		for (let playerPos of this.playerPositions) {
			if (point.x >= playerPos.left && point.x <= playerPos.right &&
				point.y <= playerPos.bottom && point.y >= playerPos.top && 
				ball.playerID !== playerPos.id && !ball.collided) {
				playerPos.player.hit();
				ball.stop();
			}
		}
	}

	checkCollision(ball) {
		let topLeft = new Vector(ball.pos.x, ball.pos.y);
		let bottomLeft = new Vector(ball.pos.x, ball.pos.y + ball.size.y);
		let topRight = new Vector(ball.pos.x + ball.size.x, ball.pos.y);
		let bottomRight = new Vector(ball.pos.x + ball.size.x, ball.pos.y + ball.size.y);

		this.checkBoundaries(topLeft, ball);
		this.checkBoundaries(bottomLeft, ball);
		this.checkBoundaries(topRight, ball);
		this.checkBoundaries(bottomRight, ball);
	}
}

module.exports = PlayerCollider;