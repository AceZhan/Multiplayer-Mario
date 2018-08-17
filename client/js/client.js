import {loadBackgroundSprites} from './sprites.js';
import {createBackgroundLayer} from './layers.js';
import {loadMarioSprite} from './sprites.js';


const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

Promise.all([
	loadBackgroundSprites(),
	loadMarioSprite(),
])
.then(([sprites, mario) => {

	player.draw = function drawPlayer(context) {
		sprite.draw('idle', context, player.pos.x, player.pos.y);
	}


	
});