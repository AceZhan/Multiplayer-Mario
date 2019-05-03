import {loadBackgroundSprites, loadMarioSprite, loadAbilities, loadExplosion, loadHearts} from './sprites.js';
import {loadFont} from './font.js';
import {createBackgroundLayer} from './layers.js';
import {correctFrame, correctDirection} from './animationhandler.js';
import {handleKeyDown, handleKeyUp, handleRevive} from './keyhandlers.js';

let socket = io();

// Load Sounds
let backgroundMusic = new Howl({
  src: ['/client/assets/backgroundmusic.mp3'],
  autoplay: true,
  loop: true,
  volume: 0.5,
});

let gameOverSound = new Howl({
  src: ['/client/assets/gameover.mp3']
});

let jumpSound = new Howl({
  src: ['/client/assets/jump.mp3'],
  volume: 0.5
});

let marioDieSound = new Howl({
  src: ['/client/assets/mariodie.mp3'],
  volume: 0.5,
});

let fireBallSound = new Howl({
  src: ['/client/assets/fireball.mp3'],
  volume: 0.5,
});

// Set-up keyboard handlers
let handleKeyDownWrapper = function() {
	handleKeyDown(event, socket, jumpSound, fireBallSound);
};

let handleKeyUpWrapper = function() {
	handleKeyUp(event, socket);
};

let handleReviveWrapper = function() {
	handleRevive(event, socket);
};

let handleGameStart = function() {
	const { keyCode } = event;
	if (keyCode === 32) {
		// Remove Game Start event listener
		window.removeEventListener('keydown', handleGameStart);
		gameStart = true;
	}
}


// Canvas
const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');
context.imageSmoothingEnabled = false;

// Player and Game State
let dead = false;
let gameStart = false;

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

	// Set up start Screen
	context.drawImage(backgroundBuffer, 0, 0);

	window.addEventListener('keydown', handleGameStart);
	
	// Setup background music
	backgroundMusic.play();

	socket.on('newPosition', (data) => {

		if (gameStart) {
			// Add movement event listeners
			window.addEventListener('keydown', handleKeyDownWrapper);
			window.addEventListener('keyup', handleKeyUpWrapper);

			context.drawImage(backgroundBuffer, 0, 0);

			let positions = data.positions;
			let playerID = data.playerID;
			let playerNumber;
			let hp;

			for (let i = 0; i < positions.length; ++i) {
				if (playerID === positions[i].id) {
					hp = positions[i].hp;
					playerNumber = positions[i].number;
				}
			}

			for (let i = 0; i < positions.length; i++) {
				font.print('Player ' + positions[i].number, context, positions[i].x - 8, positions[i].y - 8, 0.7);

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

			if (hp === undefined) {
				backgroundMusic.stop();
				marioDieSound.play();
				marioDieSound.on('end', () => {
					gameOverSound.play();
				});

				font.print('GAME OVER', context, 164, 64, 2);
				font.print('Press Space to Play Again', context, 134, 84, 1);
				if (!dead) {
					window.removeEventListener('keydown', handleKeyDownWrapper);
					window.removeEventListener('keyup', handleKeyUpWrapper);
					window.addEventListener('keydown', handleReviveWrapper);
					dead = true;
					}
			} else {
				if (dead) {
					window.removeEventListener('keydown', handleReviveWrapper);
					window.addEventListener('keydown', handleKeyDownWrapper);
					window.addEventListener('keyup', handleKeyUpWrapper);

					dead = false;
				}

				font.print('Player ' + playerNumber + ':', context, 4, 12);
				font.print('W to JUMP', context, 424, 8);
				font.print('A/D to move LEFT/RIGHT', context, 320, 18);
				font.print('SPACE to SHOOT', context, 384, 28);
				for (let h = 0; h < hp; h++) {
					hearts.draw('Heart', context, h * 16 + 76, 8);
				}
			}
		}
	});
	
});

