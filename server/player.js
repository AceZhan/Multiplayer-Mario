var Vector = require( __dirname + '/vector.js');

class PlayerClass {
	constructor(id) {
		this.id = id;
		this.pos = new Vector(48, 180);
		this.vel = new Vector(0, 0);
		this.size = new Vector(14, 16);
		this.number = "" + Math.floor(10 * Math.random());
		this.maxSpd = 20;
	}

 	jump() {
 		this.vel.set(this.vel.x, -10);
 	}

 	moveRight() {
 		this.vel.set(6, this.vel.y);
 	}

 	moveLeft() {
 		this.vel.set(-6, this.vel.y);
 	}

 	cancelHorizontal() {
 		this.vel.set(0, this.vel.y);
 	}

	update() {
		this.pos.x += this.vel.x;
		this.pos.y += this.vel.y;
	}
}

module.exports = PlayerClass;
