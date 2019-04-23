export function handleKeyDown(event, socket) {
	const { keyCode } = event;
	if (keyCode === 68) // pressing D key
		socket.emit('keyPress', {inputID:'right'});
	// else if (keyCode === 83)  // pressing S key
	//	socket.emit('keyPress', {inputID:'down'});
	else if (keyCode === 65)  // pressing A key
		socket.emit('keyPress', {inputID:'left'});
	else if (keyCode === 87) // pressing jump
		socket.emit('keyPress', {inputID:'jump'});
	else if (keyCode === 32) // shooting fireball
		socket.emit('keyPress', {inputID:'shoot'});
}

export function handleKeyUp(event, socket) {
	const { keyCode } = event;
	if (keyCode === 68)  { // pressing D key
		socket.emit('keyRelease', {inputID:'right'});
	}
	// else if (keyCode === 83)  // pressing S key
	//	socket.emit('keyRelease', {inputID:'down'});
	else if (keyCode === 65)  { // pressing A key
		socket.emit('keyRelease', {inputID:'left'});
	}
}