import {loadBackgroundSprites, loadMarioSprite, loadAbilities} from './sprites.js';
import {createBackgroundLayer} from './layers.js';
import {correctFrame, correctDirection} from './animationhandler.js';

var socket = io();

const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

Promise.all([
	loadBackgroundSprites(),
	loadMarioSprite(),
	loadAbilities(),
])
.then(([sprites, mario, abilities]) => {

	let backgroundBuffer = createBackgroundLayer(sprites);

	socket.on('newPosition', (data) => {
		context.drawImage(backgroundBuffer, 0, 0);

		for (let i = 0; i < data.length; i++) {
			mario.draw(correctFrame(data[i].velX, data[i].velY, data[i].distance),
			 context, data[i].x, data[i].y, correctDirection(data[i].direction, data[i].velX));

			for (let j = 0; j < data[i].fireballs.length; j++) {
				abilities.draw('Fireball', context, (data[i].fireballs)[j].pos.x, (data[i].fireballs)[j].pos.y)
			}
		}

	});


	window.addEventListener('keydown', event => {
		const { keyCode } = event;
		if (keyCode === 68) // pressing D key
			socket.emit('keyPress', {inputID:'right'});
		// else if (keyCode === 83)  // pressing S key
		//	socket.emit('keyPress', {inputID:'down'});
		else if (keyCode === 65)  // pressing A key
			socket.emit('keyPress', {inputID:'left'});
		else if (keyCode === 87) // pressing jump
			socket.emit('keyPress', {inputID:'jump'});
		else if (keyCode == 32) // shooting fireball
			socket.emit('keyPress', {inputID:'shoot'});
	});


	window.addEventListener('keyup', event => {
		const { keyCode } = event;
		if (keyCode === 68)  // pressing D key
			socket.emit('keyRelease', {inputID:'right'});

		// else if (keyCode === 83)  // pressing S key
		//	socket.emit('keyRelease', {inputID:'down'});
		else if (keyCode === 65)  // pressing A key
			socket.emit('keyRelease', {inputID:'left'});
	});
	
});

