let express = require('express');
let app = express();
let serv = require('http').Server(app);
let Matrix = require( __dirname + '/server/matrix.js');
let TileCollider = require( __dirname + '/server/tilecollision.js');
let PlayerClass = require( __dirname + '/server/player.js');

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/client/index.html');
});

app.use('/client',express.static(__dirname + '/client'));

serv.listen(2000);
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
io.sockets.on('connection', function(socket) {
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
	let pack =[];

	for (let i in PLAYER_LIST) {
		let player = PLAYER_LIST[i];

		player.vel.y += gravity;

		player.updateX();
		tileCollider.checkX(player);

		player.updateY();
		tileCollider.checkY(player);

		pack.push({
			x:player.pos.x,
			y:player.pos.y,
			number:player.number,
			dirX:player.vel.x,
			dirY:player.vel.y,
			distance:player.distance
		});
	}

	for (let i in SOCKET_LIST) {
		let socket = SOCKET_LIST[i];
		socket.emit('newPosition', pack);
	}

}, 1000/48);