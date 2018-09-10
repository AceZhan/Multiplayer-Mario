import {loadBackgroundSprites, loadMarioSprite} from './sprites.js';
import {createBackgroundLayer} from './layers.js';
import {correctFrame} from './animationhandler.js';

var socket = io();

const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

Promise.all([
	loadBackgroundSprites(),
	loadMarioSprite(),
])
.then(([sprites, mario]) => {

	let backgroundBuffer = createBackgroundLayer(sprites);

	

	socket.on('newPosition', (data) => {
		context.drawImage(backgroundBuffer, 0, 0);
		
		for (var i = 0; i < data.length; i++) {
			mario.draw(correctFrame(data[i].dirX, data[i].dirY, data[i].distance),
			 context, data[i].x, data[i].y);
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
		else if (keyCode === 32) // pressing jump
			socket.emit('keyPress', {inputID:'jump'});
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

