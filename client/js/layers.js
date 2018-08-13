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
}

export function createBackgroundLayer(sprites) {
	const buffer = document.createElement('canvas');
	buffer.width = 256;
	buffer.height = 240;

	drawBackground(sprites, buffer.getContext('2d'));

	return buffer;
}