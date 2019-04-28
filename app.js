let express = require('express');
let app = express();
let serv = require('http').Server(app);
let Matrix = require( __dirname + '/server/matrix.js');
let TileCollider = require( __dirname + '/server/tilecollision.js');
let PlayerCollider = require( __dirname + '/server/playercollision.js');
let PlayerClass = require( __dirname + '/server/player.js');
let port = process.env.PORT || 2000;

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/client/index.html');
});

app.use('/client',express.static(__dirname + '/client'));

serv.listen(port);
console.log('Server Started');

const deltaTime = 1/60;
const gravity = 0.5;

// Create Tiles (refactor into new file later)
let levelTiles = new Matrix();

for (let x = 0; x < 25; ++x) {
	for (let y = 0; y < 14; ++y) {
		levelTiles.set(x, y, {
			name:'sky'
		});
	}
}

for (let x = 2; x < 29; ++x) {
	for (let y = 16; y < 18; ++y) {
		levelTiles.set(x, y, {
			name: 'ground',
		});
	}
}

for (let x = 6; x < 10; ++x) {
	levelTiles.set(x, 13, {
		name: 'ground',
	});
}

for (let x = 13; x < 17; ++x) {
	levelTiles.set(x, 13, {
		name: 'ground',
	});
}

for (let x = 20; x < 24; ++x) {
	levelTiles.set(x, 13, {
		name: 'ground',
	});
}


for (let x = 9; x < 13; ++x) {
	levelTiles.set(x, 10, {
			name: 'ground',
	});
}

for (let x = 17; x < 21; ++x) {
	levelTiles.set(x, 10, {
		name: 'ground',
	});
}

let tileCollider = new TileCollider(levelTiles);

// List to store multiple players
let SOCKET_LIST = {};
let PLAYER_LIST = {};
let DEAD_PLAYER_LIST = {};

let io = require('socket.io')(serv, {});
io.sockets.on('connection', socket => {
	console.log('socket connection');

	socket.id = Math.random();
	SOCKET_LIST[socket.id] = socket;

	let player = new PlayerClass(socket.id);

	PLAYER_LIST[socket.id] = player;

	socket.on('disconnect', () => {
		delete SOCKET_LIST[socket.id];
		delete PLAYER_LIST[socket.id];
	});


	socket.on('keyPress', data => {
		if (player.state) {
			if (data.inputID === 'jump' && (player.alreadyJumped == false)) {
			player.jump();
			} else if (data.inputID === 'shoot') {
		    	player.shoot();
			}

			if (data.inputID === 'left') {
				player.moveLeft();
			} else if (data.inputID === 'right') {
				player.moveRight();
			}
		}
	});

	socket.on('keyRelease', data => {
		if (player.state) {
			if ((data.inputID === 'left') || (data.inputID === 'right'))  {
				player.cancelHorizontal();
			} 
		}
	});

	socket.on('revive', () => {
		PLAYER_LIST[socket.id] = DEAD_PLAYER_LIST[socket.id]
		delete DEAD_PLAYER_LIST[socket.id];
		// player.state = true;
		player.hp = 3;
	});
});

setInterval(() => {
	let positions = [];
	let playerCollider = new PlayerCollider();

	for (let i in PLAYER_LIST) {
		let player = PLAYER_LIST[i];

		if (player.hp <= 0) {
			DEAD_PLAYER_LIST[i] = player;
			delete PLAYER_LIST[i];
			// player.state = false;
		}

		player.vel.y += gravity;

		player.updateX();
		tileCollider.checkXPlayer(player);

		player.updateY();
		tileCollider.checkYPlayer(player);

		playerCollider.add({
			id: player.id,
			player: player,
			left: player.pos.x + 2,
			right: player.pos.x + player.size.x - 2,
			top: player.pos.y + 2,
			bottom: player.pos.y + player.size.y - 2,
		});
	}

	for (let i in PLAYER_LIST) {
		let player = PLAYER_LIST[i];

		(player.fireballs).forEach((ball) => {
			ball.vel.y += gravity;

			ball.updateX();
			tileCollider.checkXBall(ball);

			ball.updateY();
			tileCollider.checkYBall(ball);

			playerCollider.checkCollision(ball);
		});

		player.filter();

		(player.fireballs).forEach((ball) => {
			if (ball.collided) {
				ball.explode();
			}
		});

		positions.push({
			id: player.id,
			x: player.pos.x,
			y: player.pos.y,
			number: player.number,
			velX: player.vel.x,
			velY: player.vel.y,
			direction: player.direction,
			distance: player.distance,
			fireballs: player.fireballs,
			hp: player.hp,
			state: player.state
		});
	}

	for (let i in SOCKET_LIST) {
		let socket = SOCKET_LIST[i];
		let pack = {
			playerID: socket.id,
			positions: positions
		}
		socket.emit('newPosition', pack);
	}

}, 1000/48);