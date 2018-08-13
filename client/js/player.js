import Entity from './entity.js';
import {loadMarioSprite} from './sprites.js';

export function createPlayer() {
	return loadMarioSprite()
	.then (sprite => {
		const player = new Entity();

		player.draw = function drawPlayer(context) {
			sprite.draw('idle', context, player.pos.x, player.pos.y);
		}
		player.update = function updatePlayer(deltaTime) {
			this.pos.x += this.vel.x * deltaTime;
			this.pos.y += this.vel.y * deltaTime;
		}

		return player;
	});
	
}