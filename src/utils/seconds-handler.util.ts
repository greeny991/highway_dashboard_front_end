export function secondsToHHMMSSMillisecond(seconds: number): string {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const secs = Math.floor(seconds % 60);
	const milliseconds = Math.floor((seconds * 1000) % 1000);
	const formattedHours = String(hours).padStart(2, '0');
	const formattedMinutes = String(minutes).padStart(2, '0');
	const formattedSeconds = String(secs).padStart(2, '0');
	const formattedMilliseconds = String(milliseconds).padStart(3, '0');

	return `${formattedHours}:${formattedMinutes}:${formattedSeconds}:${formattedMilliseconds}`;
}

export function secondsToHHMMSS(seconds: number): string {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const secs = Math.floor(seconds % 60);
	const formattedHours = String(hours).padStart(2, '0');
	const formattedMinutes = String(minutes).padStart(2, '0');
	const formattedSeconds = String(secs).padStart(2, '0');

	return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

export function secondsToMMSS(seconds: number): string {
	const minutes = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	const formattedMinutes = String(minutes).padStart(2, '0');
	const formattedSeconds = String(secs).padStart(2, '0');

	return `${formattedMinutes}:${formattedSeconds}`;
}

export function hhmmssToSeconds(time: string): number {
	const [hours, minutes, seconds] = time.split(':').map(Number);
	return hours * 3600 + minutes * 60 + seconds;
}
