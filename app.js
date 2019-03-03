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

// Create Tiles
let levelTiles = new Matrix();

for (let x = 0; x < 25; ++x) {
	for (let y = 0; y < 14; ++y) {
		levelTiles.set(x, y, {
			name:'sky'
		});
	}
}

for (let x = 0; x < 25; ++x) {
	for (let y = 12; y < 14; ++y) {
		levelTiles.set(x, y, {
			name: 'ground',
		});
	}
}

for (let x = 12; x < 16; ++x) {
	levelTiles.set(x, 9, {
		name: 'ground',
	});
}

for (let x = 6; x < 9; ++x) {
	levelTiles.set(x, 11, {
			name: 'ground',
	});
}

for (let x = 3; x < 5; ++x) {
	levelTiles.set(x, 9, {
		name: 'ground',
	});
}

let tileCollider = new TileCollider(levelTiles);

// List to store multiple players
let SOCKET_LIST = {};
let PLAYER_LIST = {};

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
	});

	socket.on('keyRelease', data => {
		if ((data.inputID === 'left') || (data.inputID === 'right'))  {
			player.cancelHorizontal();
		} 
	});
});

setInterval(() => {
	let positions = [];
	let playerCollider = new PlayerCollider();

	for (let i in PLAYER_LIST) {
		let player = PLAYER_LIST[i];

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
			bottom: player.pos.y + player.size.y - 2
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
			hp: player.hp
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