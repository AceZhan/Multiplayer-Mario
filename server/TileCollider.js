class TileResolver {
	constructor(matrix, tileSize = 16) {
		this.matrix = matrix;
		this.tileSize = tileSize;
	}

	toIndex(pos) {
		return Math.floor(pos / this.tileSize);
	}

	getByIndex(indexX, indexY) {
		const tile = this.matrix.get(indexX, indexY);
		if (tile) {
			return tile;
		}
	}

	matchByPosition(posX, posY) {
		return this.getByIndex(
			this.toIndex(posX),
			this.toIndex(posY));
	}
}

class TileCollider {
	constructor(tileMatrix) {
	this.tiles = new TileResolver(tileMatrix);
	}

	test(player) {
		const match = this.tiles.matchByPosition(player.pos.x, player.pos.y);
		if (match) {
			console.log('Matched tile', match);
		}
	}
}

module.exports = {
	TileResolver,
	TileCollider
}