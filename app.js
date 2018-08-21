var express = require('express');
var app = express();
var serv = require('http').Server(app);
var math = require( __dirname + '/server/math.js');

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/client/index.html');
});

app.use('/client',express.static(__dirname + '/client'));

serv.listen(2000);
console.log('Server Started');

function Player(id) {
	this.pos = new math.Vector(0, 0);
	this.id = id;
	this.number = "" + Math.floor(10 * Math.random());
	this.pressingRight = false;
	this.pressingLeft = false;
	this.pressingUp = false;
	this.pressingDown = false;
	this.maxSpd = 10;

	this.update = function() {
		if (this.pressingRight)
			this.pos.x += this.maxSpd;
		if (this.pressingLeft)
			this.pos.x -= this.maxSpd;
		if (this.pressingUp)
			this.pos.y -= this.maxSpd;
		if (this.pressingDown)
			this.pos.y += this.maxSpd;
	}
}


// List to store multiple players
var SOCKET_LIST = {};
var PLAYER_LIST = {};

var io = require('socket.io')(serv, {});
io.sockets.on('connection', function(socket) {
	console.log('socket connection');

	socket.id = Math.random();
	SOCKET_LIST[socket.id] = socket;

	var player = new Player(socket.id);
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
	});


});

setInterval(() => {
	var pack =[];

	for (var i in PLAYER_LIST) {
		var player = PLAYER_LIST[i];
		player.update();
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

}, 1000/25);