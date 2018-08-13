import {loadImage} from './loaders.js';
import SpriteSheet from './SpriteSheet.js';

export function loadBackgroundSprites() {
	return loadImage('/client/assets/tileset.png')
	.then(image => {
		const sprites = new SpriteSheet(image, 16, 16);
		sprites.defineTile('ground', 0, 0);
		sprites.defineTile('sky', 3, 23);
		return sprites;
	});
}

export function loadMarioSprite() {
	return loadImage('/client/assets/characters.gif')
	.then(image => {
		const sprites = new SpriteSheet(image, 16, 16);
		sprites.define('idle', 276, 44, 16, 16);
		return sprites;
	});
}