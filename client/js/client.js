import {loadBackgroundSprites, loadMarioSprite} from './sprites.js';
import {createBackgroundLayer} from './layers.js';

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
			mario.draw('idle', context, data[i].x, data[i].y);
		}

	});


	window.addEventListener('keydown', event => {
		const { keyCode } = event;

		if (keyCode === 68) // pressing D key
			socket.emit('keyPress', {inputID:'right', state:true});
		else if (keyCode === 83)  // pressing S key
			socket.emit('keyPress', {inputID:'down', state:true});
		else if (keyCode === 65)  // pressing A key
			socket.emit('keyPress', {inputID:'left', state:true});
		else if (keyCode === 87)  // pressing W key
			socket.emit('keyPress', {inputID:'up', state:true});
	});

	window.addEventListener('keyup', event => {
		const { keyCode } = event;
		if (keyCode === 68)  // pressing D key
			socket.emit('keyPress', {inputID:'right', state:false});
		else if (keyCode === 83)  // pressing S key
			socket.emit('keyPress', {inputID:'down', state:false});
		else if (keyCode === 65)  // pressing A key
			socket.emit('keyPress', {inputID:'left', state:false});
		else if (keyCode === 87)  // pressing W key
			socket.emit('keyPress', {inputID:'up', state:false});
	});
	
});

