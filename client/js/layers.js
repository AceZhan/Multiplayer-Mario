function drawBackground(sprites, context) {
	for (let x = 0; x < 32; ++x) {
		for (let y = 0; y < 51; ++y) {
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

	for (let x = 6; x < 9; ++x) {
		sprites.drawTile('ground', context, x, 11);
	}

	for (let x = 3; x < 5; ++x) {
		sprites.drawTile('ground', context, x, 9);
	}
}

export function createBackgroundLayer(sprites) {
	const buffer = document.createElement('canvas');
	buffer.width = 2048;
	buffer.height = 360;

	drawBackground(sprites, buffer.getContext('2d'));

	return buffer;
}