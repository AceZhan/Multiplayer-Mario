import {loadBackgroundSprites, loadMarioSprite} from './sprites.js';
import {createBackgroundLayer} from './layers.js';

const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

class Vec2 {
	constructor(x, y) {
		this.set(x, y);
	}

	set(x, y) {
		this.x = x;
		this.y = y;
	}
}

class Entity {
	constructor() {
		this.pos = new Vec2(0, 0);
		this.vel = new Vec2(0, 0);
	}
}

Promise.all([
	loadBackgroundSprites(),
	loadMarioSprite(),
])
.then(([sprites, playerSprite]) => {
	const gravity = 0.5;

	const player = new Entity();
	player.pos.set(64, 180);
	player.vel.set(2, -10);

	player.update = function updatePlayer() {
		this.pos.x += this.vel.x;
		this.pos.y += this.vel.y;
	}

	player.draw = function drawPlayer(context) {
		playerSprite.draw('idle', context, player.pos.x, player.pos.y);
	}

	function update() {
		let backgroundBuffer = createBackgroundLayer(sprites);

		context.drawImage(backgroundBuffer, 0, 0);
		player.update();
		player.draw(context);
		player.vel.y += gravity;

		requestAnimationFrame(update);
	}

	update();
});