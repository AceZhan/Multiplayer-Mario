class PlayerCollider {
	constructor() {
		this.playerPositions = [];
	}

	add(playerPositions) {
		this.playerPositions.push(playerPositions);
	}

	checkCollision(ball, shooter) {

		for (let i = 0; i < this.playerPositions.length; ++i) {
			if (i === shooter) continue;
			else {
				let position = this.playerPositions[i];
				if (ball.pos.x >= position.left && ball.pos.x <= position.right &&
					ball.pos.y <= position.bottom && ball.pos.y >= position.top) {
					ball.vel.x = 0;
					ball.vel.y = 0;
				}
			}
		}
	}
}

module.exports = PlayerCollider;