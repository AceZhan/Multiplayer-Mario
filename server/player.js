import Entity from './entity.js';


export function createPlayer() {
	const player = new Entity();

	player.update = function updatePlayer(deltaTime) {
		this.pos.x += this.vel.x * deltaTime;
		this.pos.y += this.vel.y * deltaTime;
	}

	return player;
}