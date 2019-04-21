function drawBackground(sprites, context) {
	for (let x = 0; x < 32; ++x) {
		for (let y = 0; y < 51; ++y) {
			sprites.drawTile('sky', context, x, y);
		}
	}

	for (let x = 2; x < 29; ++x) {
		for (let y = 16; y < 18; ++y) {
			sprites.drawTile('ground', context, x, y);
		}
	}

	for (let x = 6; x < 10; ++x) {
		sprites.drawTile('ground', context, x, 13);
	}

	for (let x = 13; x < 17; ++x) {
		sprites.drawTile('ground', context, x, 13);
	}

	for (let x = 20; x < 24; ++x) {
		sprites.drawTile('ground', context, x, 13);
	}

	for (let x = 9; x < 13; ++x) {
		sprites.drawTile('ground', context, x, 10);
	}

	for (let x = 17; x < 21; ++x) {
		sprites.drawTile('ground', context, x, 10);
	}
}

export function createBackgroundLayer(sprites) {
	const buffer = document.createElement('canvas');
	buffer.width = 2048;
	buffer.height = 360;

	drawBackground(sprites, buffer.getContext('2d'));

	return buffer;
}