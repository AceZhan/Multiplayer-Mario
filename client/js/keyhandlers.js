export function handleKeyDown(event, socket, state) {
	const { keyCode } = event;
	if (keyCode === 68) { // pressing D key
		socket.emit('keyPress', {inputID:'right'});
	}
	// else if (keyCode === 83)  // pressing S key
	//	socket.emit('keyPress', {inputID:'down'});
	else if (keyCode === 65)  { // pressing A key
		socket.emit('keyPress', {inputID:'left'});
	}
	else if (keyCode === 87) { // pressing jump
		if (state.jumped === false) {
			// state.jumped = true;
		}
		socket.emit('keyPress', {inputID:'jump'});
	}
	else if (keyCode === 32) { // shooting fireball
		if (state.shot === false) {
			state.shot = true;
		}
		socket.emit('keyPress', {inputID:'shoot'});
	}
}

export function handleKeyUp(event, socket, state) {
	const { keyCode } = event;
	if (keyCode === 68)  { // pressing D key
		socket.emit('keyRelease', {inputID:'right'});
	} else if (keyCode === 65)  { // pressing A key
		socket.emit('keyRelease', {inputID:'left'});
	} else if (keyCode === 32) {
		state.shot = false;
		socket.emit('keyRelease', {inputID:'shoot'});
	}
}

export function handleRevive(event, socket) {
	const { keyCode } = event;
	if (keyCode === 32) {
		socket.emit('revive');
	}
}