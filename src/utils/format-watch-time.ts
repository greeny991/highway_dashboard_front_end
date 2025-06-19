export function formatWatchTime(seconds: number): string {
	if (seconds < 60) {
		return `${Math.round(seconds)}s`;
	}
	if (seconds < 3600) {
		return `${Math.round(seconds / 60)}m`;
	}
	return `${(seconds / 3600).toFixed(1)}h`;
}
