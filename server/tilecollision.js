class TileIdentifier {
	constructor(matrix, tileSize = 16) {
		this.matrix = matrix;
		this.tileSize = tileSize;
	}

	toIndex(pos) {
		return Math.floor(pos / this.tileSize);
	}

	getByIndex(indexX, indexY) {
		const tileType = this.matrix.get(indexX, indexY);
		if (tileType) {
			const y1 = indexY * this.tileSize;
			const x1 = indexX * this.tileSize;
			return {
				tileType,
				x1,
				y1
			};
		}
	}

	tileTypeByPos(posX, posY) {
		return this.getByIndex(
			this.toIndex(posX),
			this.toIndex(posY));
	}
}

class TileCollider {
	constructor(tileMatrix) {
	this.tiles = new TileIdentifier(tileMatrix);
	}

	checkBelow(player) {
		const match = this.tiles.tileTypeByPos(player.pos.x, player.pos.y);

		if (!tileType) {
			return;
		}

		if (tileTile !== 'ground') {
			return;
		}

		if (player.vel.y > 0) {
			if (player.pos.y > match.y1 ) {
				player.pos.y = match.y1;
				entity.vel.y = 0;
			}
		}
	}

	test(player) {
		const tileType = this.tiles.tileTypeByPos(player.pos.x, player.pos.y);
		if (tileType) {
			console.log('Matched tile', tileType);
		}
	}
}

module.exports = TileCollider;