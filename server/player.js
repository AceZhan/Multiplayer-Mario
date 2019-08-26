let Vector = require( __dirname + '/vector.js');
let Fireball = require( __dirname + '/abilities.js')

class PlayerClass {
	constructor(id, playerNumber) {
		this.id = id;
		this.hp = 3;
		this.size = new Vector(14, 16);
		this.number = "" + Math.floor(10 * Math.random());
		this.vel = new Vector(0, 0);
		this.distance = 0;
		this.alreadyJumped = false;
		this.shotRecently = false;
		this.fireballCount = 0;
		this.fireballs = [];
		this.state = true;
		this.num = playerNumber;

		// Get random spawn location
		let num = this.number % 4;
		if (num === 0) {
			this.pos = new Vector(48, 180);
			this.direction = 1;
		} else if (num === 1) {
			this.pos = new Vector(424, 180);
			this.direction = 0;
		} else if (num === 2) {
			this.pos = new Vector(160, 132);
			this.direction = 1;
		} else {
			this.pos = new Vector(288, 132);
			this.direction = 0;
		}
		
	}

	resetState() {
		this.hp = 3;
		this.vel = new Vector(0, 0);
		this.distance = 0;
		this.alreadyJumped = false;
		this.shotRecently = false;
		this.fireballCount = 0;
		this.fireballs = [];
		this.state = true;

		// Get random spawn location
		let num = Math.floor(Math.random() * 100) % 4;
		if (num === 0) {
			this.pos = new Vector(48, 180);
			this.direction = 1;
		} else if (num === 1) {
			this.pos = new Vector(424, 180);
			this.direction = 0;
		} else if (num === 2) {
			this.pos = new Vector(160, 132);
			this.direction = 1;
		} else {
			this.pos = new Vector(288, 132);
			this.direction = 0;
		}
	}

 	jump() {
 		this.vel.set(this.vel.x, -8);
 		this.alreadyJumped = true;
 	}

 	moveRight() {
 		this.vel.set(2, this.vel.y);
 		this.direction = 1;
 	}

 	moveLeft() {
 		this.vel.set(-2, this.vel.y);
 		this.direction = -1;
 	}

 	cancelHorizontal() {
 		this.vel.set(0, this.vel.y);
 	}

	updateX() {
		this.pos.x += this.vel.x;
		this.distance += Math.abs(this.vel.x);
	}

	updateY() {
		this.pos.y += this.vel.y;
	}

	shoot() {
		(this.fireballs).push(new Fireball(this.id, this.pos, this.fireballCount, this.direction));
		this.shotRecently = true;
		// setTimeout(() => {
		// 	this.shotRecently = false;
		// }, 500)
		this.fireballCount++; 
	}

	filter() {
		for (let i = 0; i < this.fireballs.length; ++i) {
 			let ball = this.fireballs[i];
 			if (ball.pos.x < 0 || ball.pos.x > 500 || ball.pos.y > 360 || ball.explosionTime >= 4) {
 				this.fireballs.splice(i, 1);
 				--this.fireballCount;
 			}
		}
	}

	hit() {
		this.hp--;
	}


}

module.exports = PlayerClass;
