var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/client/index.html');
});

app.use('/client', express.static(__dirname + '/client'));

serv.listen(2000);
console.log('Server Started');


// List to store multiple players
var SOCKET_LIST = {};

var io = require('socket.io')(serv, {});
io.sockets.on('connection', function(socket) {
	socket.id = Math.random();
	socket.x = 0;
	socket.y = 0;
	SOCKET_LIST[socket.id] = socket;
	socket.number = "" + Math.floor(10 * Math.random()); 

	console.log('socket connection');

	socket.on('disconnect', () => {
		delete SOCKET_LIST[socket.id];
	});

});

setInterval(() => {
	var pack =[];

	for (var i in SOCKET_LIST) {
		var socket = SOCKET_LIST[i];
		socket.x++;
		socket.y++;
		pack.push({
			x:socket.x,
			y:socket.y,
			number:socket.number
		});
	}

	for (var i in SOCKET_LIST) {
		var socket = SOCKET_LIST[i];
		socket.emit('newPosition', pack);
	}

}, 1000/25);