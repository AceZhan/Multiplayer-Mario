var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/client/index.html');
});

app.use('/client',express.static(__dirname + '/client'));

serv.listen(2000);
console.log('Server Started');


// List to store multiple players
var SOCKET_LIST = {};
var PLAYER_LIST = {};

var Player = function(id) {
	var self = {
		x:250,
		y:250,
		id:id,
		number:"" + Math.floor(10 * Math.random()),
		pressingRight:false,
		pressingLeft:false,
		pressingUp:false,
		pressingDown:false,
		maxSpd:10
	}
	self.updatePosition = function() {
		if (self.pressingRight)
			self.x += self.maxSpd;
		if (self.pressingLeft)
			self.x -= self.maxSpd;
		if (self.pressingUp)
			self.y -= self.maxSpd;
		if (self.pressingDown)
			self.y += self.maxSpd;
	}
	return self;
}

var io = require('socket.io')(serv, {});
io.sockets.on('connection', function(socket) {
	console.log('socket connection');

	socket.id = Math.random();
	SOCKET_LIST[socket.id] = socket;

	var player = Player(socket.id);
	PLAYER_LIST[socket.id] = player;

	socket.on('disconnect', () => {
		delete SOCKET_LIST[socket.id];
		delete PLAYER_LIST[socket.id];
	});

	socket.on('keyPress', function(data) {
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
		player.updatePosition();
		pack.push({
			x:player.x,
			y:player.y,
			number:player.number
		});
	}

	for (var i in SOCKET_LIST) {
		var socket = SOCKET_LIST[i];
		socket.emit('newPosition', pack);
	}

}, 1000/25);