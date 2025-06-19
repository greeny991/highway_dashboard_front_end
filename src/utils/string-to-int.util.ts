export function StringToInt(input: string): number {
	if (!input) {
		return 0;
	}

	const numericString = input.replace(/\D/g, '');
	if (numericString === '') {
		return 0;
	}

	const result = parseInt(numericString, 10);

	return result;
}
