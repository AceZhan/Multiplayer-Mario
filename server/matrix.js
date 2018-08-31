class Matrix {
	constructor() {
		this.grid = [];
	}

	get(x, y) {
		const col = this.grid[x];
		if (col) {
			return col[y];
		}
		return undefined;
	}

	set(x, y, value) {
		if (!this.grid[x]) {
			this.grid[x] = [];
		}

		this.grid[x][y] = value;
	}
}

module.exports = Matrix;