import {loadBackgroundSprites} from './sprites.js';
import {createBackgroundLayer} from './layers.js';
import {createPlayer} from './player.js';


const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

Promise.all([
	loadBackgroundSprites(),
	createPlayer(),
])
.then(([sprites, player]) => {
	const gravity = 30;
	player.pos.set(64, 180);
	player.vel.set(200, -600);

	const deltaTime = 1/60;
	let accumulatedTime = 0;
	let lastTime = 0;

	function update(time) {
		accumulatedTime += (time - lastTime) / 1000;

		let backgroundBuffer = createBackgroundLayer(sprites);

		context.drawImage(backgroundBuffer, 0, 0);
		player.update(deltaTime);
		player.draw(context);
		player.vel.y += gravity;

		// requestAnimationFrame(update);
		setTimeout(update, 1000/60 , performance.now());

		lastTime = time;
	}

	update(0);
});