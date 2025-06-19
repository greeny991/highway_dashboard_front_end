export async function GenerateVideoThumbnails(file: File): Promise<any> {
	const video = document.createElement('video');
	const canvas = document.createElement('canvas');
	const ctx: any = canvas.getContext('2d');
	const url = URL.createObjectURL(file);
	const numberOfThumbnails = 1;
	const thumbnails = [];

	video.src = url;
	video.style.display = 'none';
	document.body.appendChild(video);
	document.body.appendChild(canvas);

	await new Promise((resolve) => {
		video.addEventListener('loadedmetadata', resolve);
	});

	const duration = video.duration;
	const interval = duration / numberOfThumbnails;

	for (let i = 0; i < numberOfThumbnails; i++) {
		video.currentTime = i * interval;

		await new Promise((resolve) => {
			video.addEventListener('seeked', resolve, { once: true });
		});

		// canvas.width = video.videoWidth;
		// canvas.height = video.videoHeight;
		canvas.width = 1980;
		canvas.height = 1200;
		ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

		const blob: any = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg'));
		const fileName = `thumbnail_${i + 1}.jpg`;
		const fileThumbnail = new File([blob], fileName, { type: 'image/jpeg' });

		thumbnails.push(fileThumbnail);
	}

	video.remove();
	canvas.remove();
	URL.revokeObjectURL(url);

	return thumbnails;
}
