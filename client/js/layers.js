function drawBackground(sprites, context) {
	for (let x = 0; x < 25; ++x) {
		for (let y = 0; y < 14; ++y) {
			sprites.drawTile('sky', context, x, y);
		}
	}

	for (let x = 0; x < 25; ++x) {
		for (let y = 12; y < 14; ++y) {
			sprites.drawTile('ground', context, x, y);
		}
	}

	for (let x = 12; x < 16; ++x) {
		sprites.drawTile('ground', context, x, 9);
	}

	for (let x = 4; x < 7; ++x) {
		sprites.drawTile('ground', context, x, 11);
	}
}

export function createBackgroundLayer(sprites) {
	const buffer = document.createElement('canvas');
	buffer.width = 256;
	buffer.height = 240;

	drawBackground(sprites, buffer.getContext('2d'));

	return buffer;
}