function loadImage(url) {
	return new Promise(resolve => {
		const image = new Image();
		image.addEventListener('lod', () => {
			resolve(image);
		});
		image.src = url;
	});
}

const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

context.fillRect(0, 0, 500, 500);

loadImage('/client/img/tileset.png')
.then(image => {
	context.drawImage(image, 0, 0);
});