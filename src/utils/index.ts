export function numberToPercentage(number?: number) {
	if (number === undefined) {
		return '-';
	}

	if (number > 0) {
		return `+${number}%`;
	} else {
		return `${number}%`;
	}
}

export function getSmartlink(mediaId: string, publicationId: string) {
	return `${process.env.NEXT_PUBLIC_BASE_APP_URL}/watch/${mediaId}/${publicationId}`;
}

export function getEmbedCode(mediaId: string, publicationId: string) {
	return `<iframe width="420" height="315" src="${process.env.NEXT_PUBLIC_BASE_APP_URL}/embed/${mediaId}/${publicationId}"></iframe>`;
}
