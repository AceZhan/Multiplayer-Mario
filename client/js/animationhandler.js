
export function correctFrame(velX, velY, distance) {
	let frames = ['run-1', 'run-3', 'run-2'];

	if (velX !== 0) {
		const frameIndex = (Math.floor(distance / 10)) %  frames.length;
		const frameName = frames[frameIndex];
		return frameName;
	}
	return 'idle';
}

export function correctDirection(playerDir, playerVel) {
	if (playerVel > 0) {
		return false;
	} else if (playerVel > 0) {
		return true;
	} else {
		if (playerDir === 1) {
			return false;
		} else {
			return true;
		}
	}
}