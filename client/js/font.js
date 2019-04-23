import {loadImage} from './loaders.js';
import SpriteSheet from './SpriteSheet.js';

class Font {
	constructor(sprites, size) {
		this.sprites = sprites;
		this.size = size;
	}

	print(text, context, x, y, scale = 1) {
		[...text].forEach((char, pos) => {
			this.sprites.draw(char, context, x + pos * this.size * scale, y, false, scale);
		});
	}
}

export function loadFont() {
	return loadImage('/client/assets/font.png')
	.then(image => {
		const sprites = new SpriteSheet(image, 16, 16);
		const size = 8;
		const rowLen = image.width;
		const chars = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
		
		for (let [index, char] of [...chars].entries()) {
			const x = index * size % rowLen;
			const y = Math.floor(index * size / rowLen) * size;
			sprites.define(char, x, y, 8, 8);
		}
		
		return new Font(sprites, size);
	});
}