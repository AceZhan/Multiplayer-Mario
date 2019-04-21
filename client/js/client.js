import {loadBackgroundSprites, loadMarioSprite, loadAbilities, loadExplosion, loadHearts} from './sprites.js';
import {loadFont} from './font.js';
import {createBackgroundLayer} from './layers.js';
import {correctFrame, correctDirection} from './animationhandler.js';

var socket = io();

const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

Promise.all([
	loadBackgroundSprites(),
	loadMarioSprite(),
	loadAbilities(),
	loadExplosion(),
	loadHearts(),
	loadFont(),
])
.then(([sprites, mario, abilities, explosion, hearts, font]) => {

	let backgroundBuffer = createBackgroundLayer(sprites);

	socket.on('newPosition', (data) => {
		context.drawImage(backgroundBuffer, 0, 0);

		let positions = data.positions;

		for (let i = 0; i < positions.length; i++) {
			mario.draw(correctFrame(positions[i].velX, positions[i].velY, positions[i].distance),
			 context, positions[i].x, positions[i].y, correctDirection(positions[i].direction, positions[i].velX));

			for (let j = 0; j < positions[i].fireballs.length; j++) {
				if ((positions[i].fireballs)[j].collided) {
					explosion.draw('Explosion', context, (positions[i].fireballs)[j].pos.x, (positions[i].fireballs)[j].pos.y);
				} else {
					abilities.draw('Fireball', context, (positions[i].fireballs)[j].pos.x, (positions[i].fireballs)[j].pos.y);
				}
			}
		}

		let playerID = data.playerID;
		let hp;
		for (let i = 0; i < positions.length; ++i) {
			if (playerID === positions[i].id) {
				hp = positions[i].hp;
			}
		}

		font.print('GAME OVER', context, 164, 64, 2);

		if (hp === undefined) {

		} else {
			for (let h = 0; h < hp; h++) {
				hearts.draw('Heart', context, h * 16 + 4, 8);
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

