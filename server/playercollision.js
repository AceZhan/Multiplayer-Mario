class PlayerCollider {
	constructor() {
		this.playerPositions = [];
	}

	add(playerPositions) {
		this.playerPositions.push(playerPositions);
	}

	checkCollision(ball) {
		for (let i = 0; i < this.playerPositions.length; ++i) {
			let player = this.playerPositions[i];
			if (ball.pos.x >= player.left && ball.pos.x <= player.right &&
				ball.pos.y <= player.bottom && ball.pos.y >= player.top && ball.playerID !== player.id) {
				ball.stop();
			}
		}
	}
}

module.exports = PlayerCollider;