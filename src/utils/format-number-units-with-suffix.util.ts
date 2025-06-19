export function formatNumberUnitsWithSuffix(value: number): string {
	if (value < 1000) {
		return value.toString();
	}

	const suffixes = ['', 'k', 'M', 'B', 'T'];
	let magnitude = Math.floor(Math.log10(value) / 3);
	if (magnitude >= suffixes.length) magnitude = suffixes.length - 1;

	const scaledValue = value / Math.pow(10, magnitude * 3);
	const roundedValue = Math.round(scaledValue * 10) / 10;

	return `${roundedValue}${suffixes[magnitude]}`;
}
