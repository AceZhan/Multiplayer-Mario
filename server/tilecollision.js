class TileIdentifier {
	constructor(matrix, tileSize = 16) {
		this.matrix = matrix;
		this.tileSize = tileSize;
	}

	toIndex(pos) {
		return Math.floor(pos / this.tileSize);
	}

	toIndexRange(pos1, pos2) {
		const pMax = Math.ceil(pos2 / this.tileSize) * this.tileSize;
		const range= [];
		let pos = pos1;
		do {
			range.push(this.toIndex(pos));
			pos += this.tileSize;
		} while (pos < pMax);
		return range;
	}

	getByIndex(indexX, indexY) {
		const tileType = this.matrix.get(indexX, indexY);
		if (tileType) {
			const y1 = indexY * this.tileSize;
			const y2 = y1 + this.tileSize;
			const x1 = indexX * this.tileSize;
			const x2 = x1 + this.tileSize;
			return {
				tileType,
				y1,
				y2,
				x1,
				x2,
			};
		}
	}

	tileTypeByPos(posX, posY) {
		return this.getByIndex(
			this.toIndex(posX),
			this.toIndex(posY));
	}

	tileTypeByRange(x1, x2, y1, y2) {
		const matches = [];
		this.toIndexRange(x1, x2).forEach(indexX => {
			this.toIndexRange(y1, y2).forEach(indexY => {
				const match = this.getByIndex(indexX, indexY);
				if (match) {
					matches.push(match);
				}
			});
		});

		return matches;
	}
}

class TileCollider {
	constructor(tileMatrix) {
	this.tiles = new TileIdentifier(tileMatrix);
	}

	checkYPlayer(player) {
		let y;
		if (player.vel.y > 0) {
			y = player.pos.y + player.size.y;
		} else if (player.vel.y < 0) {
			y = player.pos.y;
		} else {
			return;
		}

		const matches = this.tiles.tileTypeByRange(
			player.pos.x, player.pos.x + player.size.x, 
			y, y);

		matches.forEach(match => {
			if (!match) {
			return;
			}

			if (match.tileType.name !== 'ground') {
				return;
			}

			if (player.vel.y > 0) {
				if (player.pos.y + player.size.y > match.y1) {
					player.pos.y = match.y1 - player.size.y;
					player.vel.y = 0;
					player.alreadyJumped = false;
				}
			} else if (player.vel.y < 0) {
				if (player.pos.y < match.y2) {
					player.pos.y = match.y2;
					player.vel.y = 0;
				}
			}
		});
		
	}

	checkXPlayer(player) {
		let x;
		if (player.vel.x > 0) {
			x = player.pos.x + player.size.x;
		} else if (player.vel.x < 0) {
			x = player.pos.x;
		} else {
			return;
		}

		const matches = this.tiles.tileTypeByRange(
			x, x, 
			player.pos.y, player.pos.y + player.size.y);

		matches.forEach(match => {
			if (!match) {
			return;
			}

			if (match.tileType.name !== 'ground') {
				return;
			}

			if (player.vel.x > 0) {
				if (player.pos.x + player.size.x > match.x1) {
					player.pos.x = match.x1 - player.size.x;
					player.vel.x = 0;
				}
			} else if (player.vel.x < 0) {
				if (player.pos.x < match.x2) {
					player.pos.x = match.x2;
					player.vel.x = 0;
				}
			}
		});
		
	}

	checkYBall(fireball) {
		let y;
		if (fireball.vel.y > 0) {
			y = fireball.pos.y + fireball.size.y;
		} else if (fireball.vel.y < 0) {
			y = fireball.pos.y;
		} else {
			return;
		}

		const matches = this.tiles.tileTypeByRange(
			fireball.pos.x, fireball.pos.x + fireball.size.x, 
			y, y);

		matches.forEach(match => {
			if (!match) {
			return;
			}

			if (match.tileType.name !== 'ground') {
				return;
			}

			if (fireball.vel.y > 0) {
				if (fireball.pos.y + fireball.size.y > match.y1) {
					fireball.pos.y = match.y1 - fireball.size.y;
					fireball.vel.y = 0;
					fireball.alreadyJumped = false;
				}
			} else if (fireball.vel.y < 0) {
				if (fireball.pos.y < match.y2) {
					fireball.pos.y = match.y2;
					fireball.vel.y = 0;
				}
			}
		});
		
	}

	checkXBall(fireball) {
		let x;
		if (fireball.vel.x > 0) {
			x = fireball.pos.x + fireball.size.x;
		} else if (fireball.vel.x < 0) {
			x = fireball.pos.x;
		} else {
			return;
		}

		const matches = this.tiles.tileTypeByRange(
			x, x, 
			fireball.pos.y, fireball.pos.y + fireball.size.y);

		matches.forEach(match => {
			if (!match) {
			return;
			}

			if (match.tileType.name !== 'ground') {
				return;
			}

			if (fireball.vel.x > 0) {
				if (fireball.pos.x + fireball.size.x > match.x1) {
					fireball.pos.x = match.x1 - fireball.size.x;
					fireball.vel.x = 0;
				}
			} else if (fireball.vel.x < 0) {
				if (fireball.pos.x < match.x2) {
					fireball.pos.x = match.x2;
					fireball.vel.x = 0;
				}
			}
		});
		
	}
}

module.exports = TileCollider;