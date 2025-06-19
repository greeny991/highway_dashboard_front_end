export function FormatDate(date: Date): string {
	const day = '0' + date.getDate();
	const month = '0' + (date.getMonth() + 1);
	const year = date.getFullYear();
	return day.slice(-2) + '-' + month.slice(-2) + '-' + year;
}
