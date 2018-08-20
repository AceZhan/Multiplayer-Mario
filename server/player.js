import {Vector} from './math.js';

export function createPlayer(id) {
	this.pos = new Vector(0, 0);
	this.id = id;
	this.number = "" + Math.floor(10 * Math.random());
	this.pressingRight = false;
	this.pressingLeft = false;
	this.pressingUp = false;
	this.pressingDown = false;
	this.maxSpd = 10;

	this.update = function() {
		if (this.pressingRight)
			this.x += this.maxSpd;
		if (this.pressingLeft)
			this.x -= this.maxSpd;
		if (this.pressingUp)
			this.y -= this.maxSpd;
		if (this.pressingDown)
			this.y += this.maxSpd;
	}
}