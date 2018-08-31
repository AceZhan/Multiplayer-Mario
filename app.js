var express = require('express');
var app = express();
var serv = require('http').Server(app);
var Matrix = require( __dirname + '/server/matrix.js');
var TileCollider = require( __dirname + '/server/tilecollision.js');
var PlayerClass = require( __dirname + '/server/player.js');

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/client/index.html');
});

app.use('/client',express.static(__dirname + '/client'));

serv.listen(2000);
console.log('Server Started');

const deltaTime = 1/60;
const gravity = 0.5;

// Create Tiles
var levelTiles = new Matrix();

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

for (let x = 4; x < 7; ++x) {
	levelTiles.set(x, 11, {
			name: 'ground',
	});
}

var tileCollider = new TileCollider(levelTiles);


// List to store multiple players
var SOCKET_LIST = {};
var PLAYER_LIST = {};

var io = require('socket.io')(serv, {});
io.sockets.on('connection', function(socket) {
	console.log('socket connection');

	socket.id = Math.random();
	SOCKET_LIST[socket.id] = socket;

	var player = new PlayerClass(socket.id);
	PLAYER_LIST[socket.id] = player;


	socket.on('disconnect', () => {
		delete SOCKET_LIST[socket.id];
		delete PLAYER_LIST[socket.id];
	});


	socket.on('keyPress', data => {
		if (data.inputID === 'left') 
			player.pressingLeft = data.state;
		else if (data.inputID === 'right')
			player.pressingRight = data.state;
		else if (data.inputID === 'up')
			player.pressingUp = data.state;
		if (data.inputID === 'down')
			player.pressingDown = data.state;
		player.vel.set(200, 0);
	});

	socket.on('keyRelease', data => {
		if (data.inputID === 'left')
			player.pressingLeft = data.state;
		else if (data.inputID === 'right')
			player.pressingRight = data.state;
		else if (data.inputID === 'up')
			player.pressingUp = data.state;
		if (data.inputID === 'down')
			player.pressingDown = data.state;
		player.vel.set(0, 0);
	});
});

setInterval(() => {
	var pack =[];

	for (var i in PLAYER_LIST) {
		var player = PLAYER_LIST[i];
		player.update();
		player.vel.y += gravity;
		pack.push({
			x:player.pos.x,
			y:player.pos.y,
			number:player.number
		});
	}

	for (var i in SOCKET_LIST) {
		var socket = SOCKET_LIST[i];
		socket.emit('newPosition', pack);
	}

}, 1000/60);