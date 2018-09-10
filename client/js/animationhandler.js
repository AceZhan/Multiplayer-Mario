
export function correctFrame(velX, velY, distance) {
	let frames = ['run-1', 'run-3', 'run-2'];

	if (velX !== 0) {
		const frameIndex = (Math.floor(distance / 10)) %  frames.length;
		const frameName = frames[frameIndex];
		return frameName;
	}
	return 'idle';
}